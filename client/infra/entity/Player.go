package entity

type Profession struct {
	ProfessionId int `json:"professionId"`
	Level int `json:"level"`
}

type Player struct {
	CharacterId string `json:"characterId"`
	PlayerName string `json:"playerName"`
	CharacterName string `json:"characterName"`
	Team string `json:"team"`
	ClassId int `json:"classId"`
	MapId int `json:"mapId"`
	X int `json:"x"`
	Y int `json:"y"`
	MoneyInCopper int `json:"moneyInCopper"`
	Level int `json:"level"`
	IsDead bool `json:"isDead"`
	ItemIds []int `json:"itemIds"`
	LastUpdate int `json:"lastUpdate"`
	Professions []Profession `json:"professions"`
}