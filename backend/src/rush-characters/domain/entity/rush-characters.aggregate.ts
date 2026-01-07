import {BaseEsRootAggregate} from '../../../shared/domain/entity/base-es-root-aggregate';
import {RushAlreadyClosedError} from '../../../shared/domain/error/rush-already-closed.error';
import {RushAlreadyOpenError} from '../../../shared/domain/error/rush-already-open.error';
import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {
  CharacterDeadEvent,
  CharacterDeadEventType,
} from '../event/character-dead.event';
import {
  CharacterEarnGoldsEvent,
  CharacterEarnGoldsEventType,
} from '../event/character-earn-golds.event';
import {
  CharacterEquippedItemEvent,
  CharacterEquippedItemEventType,
} from '../event/character-equipped-item.event';
import {
  CharacterForgotProfessionEvent,
  CharacterForgotProfessionEventType,
} from '../event/character-forgot-profession.event';
import {
  CharacterJoinedTheRushEvent,
  CharacterJoinedTheRushEventType,
} from '../event/character-joined-the-rush.event';
import {
  CharacterLearnedProfessionEvent,
  CharacterLearnedProfessionEventType,
} from '../event/character-learned-profession.event';
import {
  CharacterLeveledUpEvent,
  CharacterLeveledUpEventType,
} from '../event/character-leveled-up.event';
import {
  CharacterLostGoldsEvent,
  CharacterLostGoldsEventType,
} from '../event/character-lost-golds.event';
import {
  CharacterPlayerNameChangedEvent,
  CharacterPlayerNameChangedEventType,
} from '../event/character-player-name-changed.event';
import {
  CharacterProfessionLeveledUpEvent,
  CharacterProfessionLeveledUpEventType,
} from '../event/character-profession-leveled-up.event';
import {
  CharacterRemovedItemEvent,
  CharacterRemovedItemEventType,
} from '../event/character-removed-item.event';
import {
  CharacterRenamedEvent,
  CharacterRenamedEventType,
} from '../event/character-renamed.event';
import {
  CharacterStatusUpdatedEvent,
  CharacterStatusUpdatedEventType,
} from '../event/character-status-updated.event';
import {
  CharacterTeamChangedEvent,
  CharacterTeamChangedEventType,
} from '../event/character-team-changed.event';
import {
  CharacterZoneChangedEvent,
  CharacterZoneChangedEventType,
} from '../event/character-zone-changed.event';
import {
  RushCharactersOpenedEvent,
  RushCharactersOpenedEventType,
} from '../event/rush-character-opened-event';
import {
  RushCharactersClosedEvent,
  RushCharactersClosedEventType,
} from '../event/rush-characters-closed.event';
import {
  RushCharactersCreatedEvent,
  RushCharactersCreatedEventType,
} from '../event/rush-characters-created.event';
import {CharacterEntity, CharacterEntityProps} from './character.entity';

export interface RushCharactersSnapshotState {
  rushName: string;
  characters: CharacterEntityProps[];
  open: boolean;
}

export const RushCharactersAggregateType = 'RushCharactersAggregate';

export class RushCharactersAggregate extends BaseEsRootAggregate<RushCharactersSnapshotState> {
  id: RushCharactersId;
  rushName: string;
  characters: CharacterEntity[];
  open: boolean;

  public constructor() {
    super();
    this.on(RushCharactersCreatedEventType, event =>
      this.onRushCharactersCreated(event as RushCharactersCreatedEvent),
    );
    this.on(CharacterJoinedTheRushEventType, event =>
      this.onCharacterJoinedTheRush(event as CharacterJoinedTheRushEvent),
    );
    this.on(CharacterDeadEventType, event =>
      this.onCharacterDead(event as CharacterDeadEvent),
    );
    this.on(CharacterStatusUpdatedEventType, event =>
      this.onCharacterStatusUpdated(event as CharacterStatusUpdatedEvent),
    );
    this.on(CharacterEarnGoldsEventType, event =>
      this.onCharacterEarnGolds(event as CharacterEarnGoldsEvent),
    );
    this.on(CharacterEquippedItemEventType, event =>
      this.onCharacterEquippedItem(event as CharacterEquippedItemEvent),
    );
    this.on(CharacterForgotProfessionEventType, event =>
      this.onCharacterForgotProfession(event as CharacterForgotProfessionEvent),
    );
    this.on(CharacterLearnedProfessionEventType, event =>
      this.onCharacterLearnedProfession(
        event as CharacterLearnedProfessionEvent,
      ),
    );
    this.on(CharacterLeveledUpEventType, event =>
      this.onCharacterLeveledUp(event as CharacterLeveledUpEvent),
    );
    this.on(CharacterLostGoldsEventType, event =>
      this.onCharacterLostGolds(event as CharacterLostGoldsEvent),
    );
    this.on(CharacterPlayerNameChangedEventType, event =>
      this.onCharacterPlayerNameChanged(
        event as CharacterPlayerNameChangedEvent,
      ),
    );
    this.on(CharacterProfessionLeveledUpEventType, event =>
      this.onCharacterProfessionLeveledUp(
        event as CharacterProfessionLeveledUpEvent,
      ),
    );
    this.on(CharacterRemovedItemEventType, event =>
      this.onCharacterRemovedItem(event as CharacterRemovedItemEvent),
    );
    this.on(CharacterRenamedEventType, event =>
      this.onCharacterRenamed(event as CharacterRenamedEvent),
    );
    this.on(CharacterTeamChangedEventType, event =>
      this.onCharacterTeamChanged(event as CharacterTeamChangedEvent),
    );
    this.on(CharacterZoneChangedEventType, event =>
      this.onCharacterZoneChanged(event as CharacterZoneChangedEvent),
    );
    this.on(RushCharactersClosedEventType, () => this.onRushCharactersClosed());
    this.on(RushCharactersOpenedEventType, () => this.onRushCharactersOpened());
  }

  /* --------------------- SERIALIZATION --------------------- */
  protected serialize(): RushCharactersSnapshotState {
    return {
      rushName: this.rushName,
      characters: this.characters.map(c => c.toSnapshot()),
      open: this.open,
    };
  }

  protected deserialize(state: RushCharactersSnapshotState) {
    this.rushName = state.rushName;
    this.characters = state.characters.map(c => new CharacterEntity(c));
    this.open = state.open;
  }

  /* --------------------- CREATION --------------------- */
  createEvent(id: string, name: string): DomainEvent {
    return new RushCharactersCreatedEvent(new RushCharactersId(id), {name});
  }

  /*  -------------------- INVARIANTS -------------------- */
  public submitRushCharactersStatus(characters: CharacterEntity[]) {
    if (!this.open) {
      throw new RushAlreadyClosedError(this.rushName);
    }
    for (const character of characters) {
      const existingOldCharacter = this.characters.find(
        c => c.characterId === character.characterId,
      );
      if (existingOldCharacter) {
        if (CharacterEntity.isMoreRecent(existingOldCharacter, character)) {
          this.raise(
            new CharacterStatusUpdatedEvent(this.id, {
              characterId: character.characterId,
              lastUpdate: character.lastUpdate,
            }),
          );
          if (
            CharacterEntity.isCharacterNameChanged(
              existingOldCharacter,
              character,
            )
          ) {
            this.raise(
              new CharacterRenamedEvent(this.id, {
                characterId: character.characterId,
                newName: character.characterName,
              }),
            );
          }
          if (
            CharacterEntity.isPlayerNameChanged(existingOldCharacter, character)
          ) {
            this.raise(
              new CharacterPlayerNameChangedEvent(this.id, {
                characterId: character.characterId,
                newName: character.playerName,
              }),
            );
          }
          if (CharacterEntity.isTeamChanged(existingOldCharacter, character)) {
            this.raise(
              new CharacterTeamChangedEvent(this.id, {
                characterId: character.characterId,
                newTeam: character.team,
              }),
            );
          }
          if (CharacterEntity.isZoneChanged(existingOldCharacter, character)) {
            this.raise(
              new CharacterZoneChangedEvent(this.id, {
                characterId: character.characterId,
                newZone: character.mapId,
              }),
            );
          }
          const {earned, lost} = CharacterEntity.isMoneyChanged(
            existingOldCharacter,
            character,
          );
          if (earned > 0) {
            this.raise(
              new CharacterEarnGoldsEvent(this.id, {
                characterId: character.characterId,
                amount: earned,
              }),
            );
          }
          if (lost > 0) {
            this.raise(
              new CharacterLostGoldsEvent(this.id, {
                characterId: character.characterId,
                amount: lost,
              }),
            );
          }
          if (CharacterEntity.isLevelChanged(existingOldCharacter, character)) {
            this.raise(
              new CharacterLeveledUpEvent(this.id, {
                characterId: character.characterId,
                newLevel: character.level,
              }),
            );
          }
          if (CharacterEntity.isDead(existingOldCharacter, character)) {
            this.raise(
              new CharacterDeadEvent(this.id, {
                characterId: character.characterId,
              }),
            );
          }
          const {itemAdded, itemRemoved} = CharacterEntity.isItemChanged(
            existingOldCharacter,
            character,
          );
          for (const item of itemAdded) {
            this.raise(
              new CharacterEquippedItemEvent(this.id, {
                characterId: character.characterId,
                itemId: item,
              }),
            );
          }
          for (const item of itemRemoved) {
            this.raise(
              new CharacterRemovedItemEvent(this.id, {
                characterId: character.characterId,
                itemId: item,
              }),
            );
          }
          const {professionsAdded, professionsRemoved, professionsLeveledUp} =
            CharacterEntity.isProfessionsChanged(
              existingOldCharacter,
              character,
            );
          for (const profession of professionsAdded) {
            this.raise(
              new CharacterLearnedProfessionEvent(this.id, {
                characterId: character.characterId,
                profession,
              }),
            );
          }
          for (const profession of professionsRemoved) {
            this.raise(
              new CharacterForgotProfessionEvent(this.id, {
                characterId: character.characterId,
                professionId: profession.professionId,
              }),
            );
          }
          for (const profession of professionsLeveledUp) {
            this.raise(
              new CharacterProfessionLeveledUpEvent(this.id, {
                characterId: character.characterId,
                professionId: profession.professionId,
                newLevel: profession.level,
              }),
            );
          }
        }
      } else {
        this.raise(
          new CharacterJoinedTheRushEvent(this.id, {
            character,
            characterId: character.characterId,
          }),
        );
      }
    }
    return this.uncommitted;
  }

  closeRushCharacters() {
    if (this.open) {
      this.raise(new RushCharactersClosedEvent(this.id, {}));
      return this.uncommitted;
    }
    throw new RushAlreadyClosedError(this.rushName);
  }

  OpenRushCharacters() {
    if (this.open) {
      throw new RushAlreadyOpenError(this.rushName);
    }
    this.raise(new RushCharactersOpenedEvent(this.id, {}));
    return this.uncommitted;
  }

  /* -------------------- EVENT HANDLERS -------------------- */

  private onRushCharactersCreated(event: RushCharactersCreatedEvent) {
    this.id = event.aggregateId;
    this.rushName = event.payload.name;
    this.characters = [];
    this.open = true;
  }

  private onCharacterJoinedTheRush(event: CharacterJoinedTheRushEvent) {
    this.characters.push(new CharacterEntity(event.payload.character));
  }

  private onCharacterStatusUpdated(event: CharacterStatusUpdatedEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.lastUpdate = event.payload.lastUpdate;
      }
      return c;
    });
  }

  private onCharacterDead(event: CharacterDeadEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.isDead = true;
      }
      return c;
    });
  }

  private onCharacterEarnGolds(event: CharacterEarnGoldsEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.moneyInCopper += event.payload.amount;
      }
      return c;
    });
  }

  private onCharacterEquippedItem(event: CharacterEquippedItemEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.itemIds.push(event.payload.itemId);
      }
      return c;
    });
  }

  private onCharacterForgotProfession(event: CharacterForgotProfessionEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.professions = c.professions.filter(
          p => p.professionId !== event.payload.professionId,
        );
      }
      return c;
    });
  }

  private onCharacterLearnedProfession(event: CharacterLearnedProfessionEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.professions.push({
          professionId: event.payload.profession.professionId,
          level: event.payload.profession.level,
        });
      }
      return c;
    });
  }

  private onCharacterLeveledUp(event: CharacterLeveledUpEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.level = event.payload.newLevel;
      }
      return c;
    });
  }

  private onCharacterLostGolds(event: CharacterLostGoldsEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.moneyInCopper -= event.payload.amount;
      }
      return c;
    });
  }

  private onCharacterPlayerNameChanged(event: CharacterPlayerNameChangedEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.playerName = event.payload.newName;
      }
      return c;
    });
  }

  private onCharacterProfessionLeveledUp(
    event: CharacterProfessionLeveledUpEvent,
  ) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.professions = c.professions.map(p => {
          if (p.professionId === event.payload.professionId) {
            p.level = event.payload.newLevel;
          }
          return p;
        });
      }
      return c;
    });
  }

  private onCharacterRemovedItem(event: CharacterRemovedItemEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.itemIds = c.itemIds.filter(item => item !== event.payload.itemId);
      }
      return c;
    });
  }

  private onCharacterRenamed(event: CharacterRenamedEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.characterName = event.payload.newName;
      }
      return c;
    });
  }

  private onCharacterTeamChanged(event: CharacterTeamChangedEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.team = event.payload.newTeam;
      }
      return c;
    });
  }

  private onCharacterZoneChanged(event: CharacterZoneChangedEvent) {
    this.characters = this.characters.map(c => {
      if (c.characterId === event.payload.characterId) {
        c.mapId = event.payload.newZone;
      }
      return c;
    });
  }

  private onRushCharactersClosed() {
    this.open = false;
  }

  private onRushCharactersOpened() {
    this.open = true;
  }
}
