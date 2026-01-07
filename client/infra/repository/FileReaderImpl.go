package repository

import (
	"fmt"
	"rush-mode-tracker/infra/entity"
	"strconv"
	"strings"

	lua "github.com/yuin/gopher-lua"
)

type FileReaderImpl struct{}

func (f *FileReaderImpl) ExtractPlayerData(filePath string) ([]entity.Player, []entity.Progression, []entity.Mail, []entity.Trade, string, error) {
	L := lua.NewState()
	defer L.Close()

	if err := L.DoFile(filePath); err != nil {
		return nil, nil, nil, nil, "", fmt.Errorf("error loading Lua file: %w", err)
	}

	val := L.GetGlobal("RushModeDB")
	tbl, ok := val.(*lua.LTable)
	if !ok {
		return nil, nil, nil, nil, "", fmt.Errorf("RushModeDB not found or invalid")
	}

	players, progressions, mails, trades, rushId := flattenTable(tbl)

	return players, progressions, mails, trades, rushId, nil
}

func flattenTable(tbl *lua.LTable) ([]entity.Player, []entity.Progression, []entity.Mail, []entity.Trade, string) {
	var rushId string
	players := make([]entity.Player, 0)
	progressions := make([]entity.Progression, 0)
	fraudMails := make([]entity.Mail, 0)
	fraudTrades := make([]entity.Trade, 0)

	tbl.ForEach(func(key, val lua.LValue) {

		switch key.String() {

		case "rushID":
			rushId = val.String()

		case "players":
			playersTbl, ok := val.(*lua.LTable)
			if !ok {
				return
			}

			playersTbl.ForEach(func(characterId, playerVal lua.LValue) {
				playerTbl, ok := playerVal.(*lua.LTable)
				if !ok {
					return
				}

				rec := entity.Player{
					CharacterId: characterId.String(),
				}

				playerTbl.ForEach(func(k, v lua.LValue) {
					switch k.String() {

					case "playerId":
						rec.CharacterId = v.String()

					case "money":
						money := strings.NewReplacer("g", "", "s", "", "c", "", " ", "").Replace(v.String())
						rec.MoneyInCopper, _ = strconv.Atoi(money)

					case "class":
						rec.ClassId = toInt(v)

					case "isDead":
						rec.IsDead = toInt(v) == 1

					case "items":
						items := strings.Split(v.String(), ",")
						for _, item := range items {
							item = strings.TrimSpace(item)
							if item == "" {
								continue
							}
							id, err := strconv.Atoi(item)
							if err == nil {
								rec.ItemIds = append(rec.ItemIds, id)
							}
						}

					case "name":
						rec.CharacterName = v.String()

					case "lastUpdate":
						rec.LastUpdate = toInt(v) * 1000

					case "team":
						rec.Team = v.String()
						
					case "mapID":
						rec.MapId = toInt(v)

					case "level":
						rec.Level = toInt(v)

					case "professions":
						profs := strings.Split(v.String(), ",")
						rec.Professions = make([]entity.Profession, 0)
						for _, prof := range profs {
							prof = strings.TrimSpace(prof)
							if prof == "" {
								continue
							}

							split := strings.Split(prof, ":")
							if len(split) != 2 {
								continue
							}

							id, err1 := strconv.Atoi(split[0])
							level, err2 := strconv.Atoi(split[1])
							if err1 != nil || err2 != nil {
								continue
							}

							rec.Professions = append(rec.Professions, entity.Profession{
								ProfessionId: id,
								Level:        level,
							})
						}

					case "player":
						rec.PlayerName = v.String()
					}
				})

				players = append(players, rec)
			})

		case "progressionEvents":
			progressionTbl, ok := val.(*lua.LTable)
			if !ok {
				return
			}

			progressionTbl.ForEach(func(playerName, achievements lua.LValue) {
				rec := entity.Progression{
					PlayerName: playerName.String(),
				}

				if achievementsTbl, ok := achievements.(*lua.LTable); ok {
					achievementsTbl.ForEach(func(k, _ lua.LValue) {
						rec.Achievements = append(rec.Achievements, k.String())
					})
				}

				progressions = append(progressions, rec)
			})

		case "fraudEvents":
			fraudPlayerTbl, ok := val.(*lua.LTable)
			if !ok {
				return
			}

			fraudPlayerTbl.ForEach(func(playerName, frauds lua.LValue) {
				fraudsTbl, ok := frauds.(*lua.LTable)
				if !ok {
					return
				}

				fraudsTbl.ForEach(func(fraudType, fraudData lua.LValue) {

					switch fraudType.String() {

					case "mails":
						mailsTbl, ok := fraudData.(*lua.LTable)
						if !ok {
							return
						}

						mailsTbl.ForEach(func(_, mail lua.LValue) {
							mailTbl, ok := mail.(*lua.LTable)
							if !ok {
								return
							}

							rec := entity.Mail{
								PlayerName: playerName.String(),
							}

							mailTbl.ForEach(func(k, v lua.LValue) {
								switch k.String() {

								case "sender":
									rec.Sender = v.String()

								case "goldTaken":
									rec.GoldTaken = toInt(v)

								case "attachments":
									raw := strings.TrimSpace(v.String())
									rec.Attachments = make([]entity.ItemAttachment, 0)
									if raw == "" {
										return
									}

									attachments := strings.Split(raw, ",")
									for _, a := range attachments {
										a = strings.TrimSpace(a)
										if a == "" {
											continue
										}

										split := strings.Split(a, "x")
										if len(split) != 2 {
											continue
										}

										id, err1 := strconv.Atoi(split[0])
										qty, err2 := strconv.Atoi(split[1])
										if err1 != nil || err2 != nil {
											continue
										}

										rec.Attachments = append(rec.Attachments, entity.ItemAttachment{
											Id:       id,
											Quantity: qty,
										})
									}

								case "timestamp":
									rec.Timestamp = toInt(v) * 1000
								}
							})

							fraudMails = append(fraudMails, rec)
						})

					case "trades":
						tradesTbl, ok := fraudData.(*lua.LTable)
						if !ok {
							return
						}

						tradesTbl.ForEach(func(_, trade lua.LValue) {
							tradeTbl, ok := trade.(*lua.LTable)
							if !ok {
								return
							}

							rec := entity.Trade{
								PlayerName: playerName.String(),
							}

							tradeTbl.ForEach(func(k, v lua.LValue) {
								switch k.String() {

								case "giver":
									rec.Giver = v.String()

								case "goldReceived":
									rec.GoldReceived = toInt(v)

								case "items":
									raw := strings.ReplaceAll(v.String(), " ", "")
									if raw == "" {
										return
									}

									items := strings.Split(raw, ",")
									rec.Items = make([]entity.ItemAttachment, 0)
									for _, item := range items {
										if item == "" {
											continue
										}

										split := strings.Split(item, ":")
										if len(split) != 2 {
											continue
										}

										id, err1 := strconv.Atoi(split[0])
										qty, err2 := strconv.Atoi(split[1])
										if err1 != nil || err2 != nil {
											continue
										}

										rec.Items = append(rec.Items, entity.ItemAttachment{
											Id:       id,
											Quantity: qty,
										})
									}

								case "timestamp":
									rec.Timestamp = toInt(v) * 1000
								}
							})

							fraudTrades = append(fraudTrades, rec)
						})
					}
				})
			})
		}
	})

	return players, progressions, fraudMails, fraudTrades, rushId
}

func toInt(v lua.LValue) int {
	if n, ok := v.(lua.LNumber); ok {
		return int(n)
	}
	return 0
}
