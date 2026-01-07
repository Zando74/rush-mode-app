export type Profession = {
  professionId: number;
  level: number;
};

export type Character = {
  characterId: string;
  playerName: string;
  characterName: string;
  team: string;
  classId: number;
  mapId: number;
  moneyInCopper: number;
  level: number;
  isDead: boolean;
  itemIds: number[];
  lastUpdate: number;
  professions: Profession[];
};

export type RushCharacters = {
  id: string;
  name: string;
  characters: Character[];
  open: boolean;
};

export type EventPayload = {
  [key: string]: unknown;
};

export type RushCharactersEvent = {
  characterId: string;
  events: {
    type: string;
    data: EventPayload;
    sequenceNumber: number;
    at: Date;
  }[];
};
