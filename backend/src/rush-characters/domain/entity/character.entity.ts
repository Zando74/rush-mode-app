import {MissingFieldError} from '../../../shared/domain/error/missing-field.error';

export interface Profession {
  professionId: number;
  level: number;
}

export interface CharacterEntityProps {
  characterId: string;
  playerName: string;
  characterName: string;
  team: string;
  mapId: number;
  classId: number;
  moneyInCopper: number;
  level: number;
  isDead: boolean;
  itemIds: number[];
  lastUpdate: number;
  professions: Profession[];
}

export class CharacterEntity {
  characterId: string;
  playerName: string;
  characterName: string;
  team: string;
  mapId: number;
  classId: number;
  moneyInCopper: number;
  level: number;
  isDead: boolean;
  itemIds: number[];
  lastUpdate: number;
  professions: Profession[];

  constructor(props: CharacterEntityProps) {
    this.validateProps(props);
    this.characterId = props.characterId;
    this.playerName = props.playerName;
    this.characterName = props.characterName;
    this.team = props.team;
    this.mapId = props.mapId;
    this.classId = props.classId;
    this.moneyInCopper = props.moneyInCopper;
    this.level = props.level;
    this.isDead = props.isDead;
    this.itemIds = props.itemIds;
    this.lastUpdate = props.lastUpdate;
    this.professions = props.professions;
  }

  toSnapshot(): CharacterEntityProps {
    return {
      characterId: this.characterId,
      playerName: this.playerName,
      characterName: this.characterName,
      team: this.team,
      mapId: this.mapId,
      classId: this.classId,
      moneyInCopper: this.moneyInCopper,
      level: this.level,
      isDead: this.isDead,
      itemIds: this.itemIds,
      lastUpdate: this.lastUpdate,
      professions: this.professions,
    };
  }

  static isMoreRecent(old: CharacterEntity, updated: CharacterEntity) {
    return old.lastUpdate < updated.lastUpdate;
  }

  static isCharacterNameChanged(
    old: CharacterEntity,
    updated: CharacterEntity,
  ) {
    return old.characterName !== updated.characterName;
  }

  static isPlayerNameChanged(old: CharacterEntity, updated: CharacterEntity) {
    return old.playerName !== updated.playerName;
  }

  static isTeamChanged(old: CharacterEntity, updated: CharacterEntity) {
    return old.team !== updated.team;
  }

  static isZoneChanged(old: CharacterEntity, updated: CharacterEntity) {
    return old.mapId !== updated.mapId;
  }

  static isMoneyChanged(
    old: CharacterEntity,
    updated: CharacterEntity,
  ): {earned: number; lost: number} {
    const oldMoney = old.moneyInCopper;
    const updatedMoney = updated.moneyInCopper;
    const earned = updatedMoney - oldMoney;
    if (earned > 0) {
      return {earned, lost: 0};
    } else {
      return {earned: 0, lost: -earned};
    }
  }

  static isLevelChanged(old: CharacterEntity, updated: CharacterEntity) {
    return old.level !== updated.level;
  }

  static isDead(old: CharacterEntity, updated: CharacterEntity) {
    return old.isDead !== updated.isDead && updated.isDead;
  }

  static isItemChanged(
    old: CharacterEntity,
    updated: CharacterEntity,
  ): {itemAdded: number[]; itemRemoved: number[]} {
    const oldItems = old.itemIds;
    const updatedItems = updated.itemIds;
    const added = updatedItems.filter(item => !oldItems.includes(item));
    const removed = oldItems.filter(item => !updatedItems.includes(item));
    return {itemAdded: added, itemRemoved: removed};
  }

  static isProfessionsChanged(
    old: CharacterEntity,
    updated: CharacterEntity,
  ): {
    professionsAdded: Profession[];
    professionsRemoved: Profession[];
    professionsLeveledUp: Profession[];
  } {
    const oldProfessions = old.professions;
    const updatedProfessions = updated.professions;

    const added = updatedProfessions
      .map(p => p.professionId)
      .filter(
        professionId =>
          !oldProfessions.map(p => p.professionId).includes(professionId),
      )
      .map(professionId => {
        return updatedProfessions.find(p => p.professionId === professionId)!;
      });

    const removed = oldProfessions
      .map(p => p.professionId)
      .filter(
        professionId =>
          !updatedProfessions.map(p => p.professionId).includes(professionId),
      )
      .map(professionId => {
        return oldProfessions.find(p => p.professionId === professionId)!;
      });

    const leveledUp = updatedProfessions.filter(profession =>
      oldProfessions.some(
        oldProfession =>
          oldProfession.professionId === profession.professionId &&
          oldProfession.level < profession.level,
      ),
    );

    return {
      professionsAdded: added,
      professionsRemoved: removed,
      professionsLeveledUp: leveledUp,
    };
  }

  private validateProps(props: CharacterEntityProps) {
    if (props.characterId === undefined) {
      throw new MissingFieldError('characterId is required');
    }
    if (props.playerName === undefined) {
      throw new MissingFieldError('playerName is required');
    }
    if (props.characterName === undefined) {
      throw new MissingFieldError('characterName is required');
    }
    if (props.team === undefined) {
      throw new MissingFieldError('team is required');
    }
    if (props.mapId === undefined) {
      throw new MissingFieldError('mapId is required');
    }
    if (props.classId === undefined) {
      throw new MissingFieldError('classId is required');
    }
    if (props.moneyInCopper === undefined) {
      throw new MissingFieldError('moneyInCopper is required');
    }
    if (props.level === undefined) {
      throw new MissingFieldError('level is required');
    }
    if (props.isDead === undefined) {
      throw new MissingFieldError('isDead is required');
    }
    if (props.itemIds === undefined) {
      throw new MissingFieldError('itemIds is required');
    }
    if (props.lastUpdate === undefined) {
      throw new MissingFieldError('lastUpdate is required');
    }
    if (props.professions === undefined) {
      throw new MissingFieldError('professions is required');
    }
  }
}
