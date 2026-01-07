import {CharacterEntityProps} from '../../../../rush-characters/domain/entity/character.entity';
import {MailEntityProps} from '../../../../rush-fraud/domain/entity/mail.entity';
import {TradeEntityProps} from '../../../../rush-fraud/domain/entity/trade.entity';
import {
  BOSS_IDS,
  CHARACTER_DEATH_PROBABILITY,
  CHARACTER_EARN_GOLD_PROBABILITY,
  CHARACTER_EQUIP_ITEM_PROBABILITY,
  CHARACTER_FORGOT_PROFESSION_PROBABILITY,
  CHARACTER_JOINED_RUSH_PROBABILITY,
  CHARACTER_KILL_BOSS_PROBABILITY,
  CHARACTER_LEARN_PROFESSION_PROBABILITY,
  CHARACTER_LEVELUP_PROBABILITY,
  CHARACTER_LOST_GOLD_PROBABILITY,
  CHARACTER_PROFESSION_LEVELUP_PROBABILITY,
  CHARACTER_REMOVED_ITEM_PROBABILITY,
  CHARACTER_RENAME_PROBABILITY,
  CHARACTER_TEAM_CHANGE_PROBABILITY,
  CHARACTER_ZONE_CHANGE_PROBABILITY,
  CLASS_IDS,
  ITEM_REAGENTS_IDS,
  ITEM_STUFF_IDS,
  MAIL_GOLD_TAKEN_PROBABILITY,
  MAIL_ITEMS_PROBABILITY,
  MAP_IDS,
  namePrefixes,
  nameSuffixes,
  PLAYER_IN_RUSH,
  PROFESSION_IDS,
  TEAMS,
  TRADE_GOLD_RECEIVED_PROBABILITY,
  TRADE_ITEMS_PROBABILITY,
  UPDATE_INTERVAL_MS,
} from './config';

interface Player {
  playerName: string;
  currentCharacters: CharacterEntityProps[];
}

interface Fraud {
  mails: MailEntityProps[];
  trades: TradeEntityProps[];
}

interface Progression {
  playerName: string;
  achievements: string[];
}

export class FakeAddon {
  name = 'rush-demo';
  rushId = 'cab07a59-7579-4d1a-9540-7928ff895523';
  players: Player[] = [];
  frauds: Fraud = {mails: [], trades: []};
  progressions: Progression[] = [];
  timer?: NodeJS.Timeout;

  constructor() {
    for (let i = 0; i < PLAYER_IN_RUSH; i++) {
      this.players.push({playerName: `player-${i}`, currentCharacters: []});
    }
  }

  start() {
    if (this.timer) return;

    this.timer = setInterval(() => {
      this.tick();
    }, UPDATE_INTERVAL_MS);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  private tick() {
    this.players.forEach(player => {
      if (
        player.currentCharacters.length > 0 &&
        player.currentCharacters.some(c => !c.isDead)
      ) {
        player.currentCharacters
          .filter(c => !c.isDead)
          .forEach(c => {
            this.maybeCharacterDied(c);
            this.maybeCharacterEarnedGold(c);
            this.maybeCharacterEquippedItem(c);
            this.maybeCharacterForgotProfession(c);
            this.maybeCharacterLearnedProfession(c);
            this.maybeCharacterLeveledUp(c);
            this.maybeCharacterLostGold(c);
            this.maybeCharacterProfessionLeveledUp(c);
            this.maybeCharacterRemovedItem(c);
            this.maybeCharacterRenamed(c);
            this.maybeCharacterTeamChanged(c);
            this.maybeCharacterZoneChanged(c);
            this.maybeCharacterFraudMailRegistered(c);
            this.maybeCharacterFraudTradeRegistered(c);
            this.maybeCharacterKillBoss(c);
          });
      } else {
        this.maybeCharacterJoinedRush(player);
      }
    });
  }

  addProgression(playerName: string, achievement: string) {
    const existingProgression = this.progressions.find(
      p => p.playerName === playerName,
    );
    if (existingProgression) {
      existingProgression.achievements.push(achievement);
      return;
    }
    this.progressions.push({
      playerName: playerName,
      achievements: [achievement],
    });
  }

  maybeCharacterDied(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_DEATH_PROBABILITY) {
      character.lastUpdate = Date.now();
      character.isDead = true;
      this.addProgression(character.playerName, 'DEATH');
      if (Math.random() < CHARACTER_DEATH_PROBABILITY) {
        this.addProgression(character.playerName, 'DEATHDUNGEON');
      }
    }
  }

  maybeCharacterEarnedGold(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_EARN_GOLD_PROBABILITY) {
      character.lastUpdate = Date.now();
      character.moneyInCopper += Math.floor(Math.random() * 100000);
    }
  }

  maybeCharacterEquippedItem(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_EQUIP_ITEM_PROBABILITY) {
      character.lastUpdate = Date.now();
      character.itemIds.push(
        ITEM_STUFF_IDS[Math.floor(Math.random() * ITEM_STUFF_IDS.length)],
      );
    }
  }

  maybeCharacterForgotProfession(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_FORGOT_PROFESSION_PROBABILITY) {
      character.lastUpdate = Date.now();
      if (character.professions.length > 0) {
        character.professions.pop();
      }
    }
  }

  maybeCharacterJoinedRush(player: Player) {
    if (Math.random() < CHARACTER_JOINED_RUSH_PROBABILITY) {
      player.currentCharacters.push({
        characterId: Math.floor(Math.random() * 100000).toString(),
        playerName: player.playerName,
        characterName:
          namePrefixes[Math.floor(Math.random() * namePrefixes.length)] +
          nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)],
        team: this.randomTeam(),
        mapId: MAP_IDS[Math.floor(Math.random() * MAP_IDS.length)],
        classId: CLASS_IDS[Math.floor(Math.random() * CLASS_IDS.length)],
        moneyInCopper: Math.floor(Math.random() * 100000),
        level: Math.floor(Math.random() * 10),
        isDead: false,
        itemIds: [
          ITEM_STUFF_IDS[Math.floor(Math.random() * ITEM_STUFF_IDS.length)],
        ],
        lastUpdate: Date.now(),
        professions: [
          {
            professionId:
              PROFESSION_IDS[Math.floor(Math.random() * PROFESSION_IDS.length)],
            level: Math.floor(Math.random() * 75),
          },
        ],
      });
    }
  }

  maybeCharacterLearnedProfession(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_LEARN_PROFESSION_PROBABILITY) {
      character.lastUpdate = Date.now();
      if (character.professions.length < 2) {
        character.professions.push({
          professionId:
            PROFESSION_IDS[Math.floor(Math.random() * PROFESSION_IDS.length)],
          level: Math.floor(Math.random() * 75),
        });
      }
    }
  }

  maybeCharacterLeveledUp(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_LEVELUP_PROBABILITY) {
      character.lastUpdate = Date.now();
      if (character.level < 60) {
        character.level += 1;
        switch (character.level) {
          case 15:
            this.addProgression(character.playerName, 'LVL15');
            break;
          case 20:
            this.addProgression(character.playerName, 'LVL20');
            break;
          case 30:
            this.addProgression(character.playerName, 'LVL30');
            break;
          case 40:
            this.addProgression(character.playerName, 'LVL40');
            break;
          case 45:
            this.addProgression(character.playerName, 'LVL45');
            break;
          case 50:
            this.addProgression(character.playerName, 'LVL50');
            break;
          case 55:
            this.addProgression(character.playerName, 'LVL55');
            break;
          case 60:
            this.addProgression(character.playerName, 'LVL60');
            break;
        }
      }
    }
  }

  maybeCharacterLostGold(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_LOST_GOLD_PROBABILITY) {
      character.lastUpdate = Date.now();
      if (character.moneyInCopper > 0) {
        character.moneyInCopper -= Math.floor(Math.random() * 100000);
        character.moneyInCopper = Math.max(character.moneyInCopper, 0);
      }
    }
  }

  maybeCharacterProfessionLeveledUp(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_PROFESSION_LEVELUP_PROBABILITY) {
      character.lastUpdate = Date.now();
      character.professions.forEach(p => {
        if (p.level < 300) {
          p.level += 1;
          switch (p.level) {
            case 75:
              this.addProgression(character.playerName, 'PROF75');
              break;
            case 100:
              this.addProgression(character.playerName, 'PROF100');
              break;
            case 150:
              this.addProgression(character.playerName, 'PROF150');
              break;
            case 200:
              this.addProgression(character.playerName, 'PROF200');
              break;
            case 250:
              this.addProgression(character.playerName, 'PROF250');
              break;
            case 300:
              this.addProgression(character.playerName, 'PROF300');
              break;
          }
        }
      });
    }
  }

  maybeCharacterRemovedItem(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_REMOVED_ITEM_PROBABILITY) {
      character.lastUpdate = Date.now();
      if (character.itemIds.length > 0) {
        character.itemIds.pop();
      }
    }
  }

  maybeCharacterRenamed(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_RENAME_PROBABILITY) {
      character.lastUpdate = Date.now();
      character.characterName =
        namePrefixes[Math.floor(Math.random() * namePrefixes.length)] +
        nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
    }
  }

  maybeCharacterTeamChanged(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_TEAM_CHANGE_PROBABILITY) {
      character.lastUpdate = Date.now();
      const teamsWithoutCurrentTeam = TEAMS.filter(t => t !== character.team);
      character.team =
        teamsWithoutCurrentTeam[
          Math.floor(Math.random() * teamsWithoutCurrentTeam.length)
        ];
    }
  }

  maybeCharacterZoneChanged(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_ZONE_CHANGE_PROBABILITY) {
      character.lastUpdate = Date.now();
      character.mapId = MAP_IDS[Math.floor(Math.random() * MAP_IDS.length)];
    }
  }

  maybeCharacterFraudMailRegistered(character: CharacterEntityProps) {
    if (Math.random() < MAIL_GOLD_TAKEN_PROBABILITY) {
      this.frauds.mails.push({
        playerName: character.playerName,
        sender: 'aNiceGuy',
        goldTaken: Math.floor(Math.random() * 100000),
        attachments: [],
        timestamp: Date.now(),
      });
    }
    if (Math.random() < MAIL_ITEMS_PROBABILITY) {
      this.frauds.mails.push({
        playerName: character.playerName,
        sender: 'aNiceGuy',
        goldTaken: 0,
        attachments: [
          {
            id: ITEM_REAGENTS_IDS[
              Math.floor(Math.random() * ITEM_REAGENTS_IDS.length)
            ],
            quantity: Math.floor(Math.random() * 10) + 1,
          },
        ],
        timestamp: Date.now(),
      });
    }
  }

  maybeCharacterFraudTradeRegistered(character: CharacterEntityProps) {
    if (Math.random() < TRADE_GOLD_RECEIVED_PROBABILITY) {
      this.frauds.trades.push({
        playerName: character.playerName,
        giver: 'aNiceGuy',
        goldReceived: Math.floor(Math.random() * 100000),
        items: [],
        timestamp: Date.now(),
      });
    }
    if (Math.random() < TRADE_ITEMS_PROBABILITY) {
      this.frauds.trades.push({
        playerName: character.playerName,
        giver: 'aNiceGuy',
        goldReceived: 0,
        items: [
          {
            id: ITEM_REAGENTS_IDS[
              Math.floor(Math.random() * ITEM_REAGENTS_IDS.length)
            ],
            quantity: Math.floor(Math.random() * 10) + 1,
          },
        ],
        timestamp: Date.now(),
      });
    }
  }

  maybeCharacterKillBoss(character: CharacterEntityProps) {
    if (Math.random() < CHARACTER_KILL_BOSS_PROBABILITY) {
      this.addProgression(
        character.playerName,
        BOSS_IDS[Math.floor(Math.random() * BOSS_IDS.length)].toString(),
      );
    }
  }

  private randomTeam() {
    return TEAMS[Math.floor(Math.random() * TEAMS.length)];
  }
}
