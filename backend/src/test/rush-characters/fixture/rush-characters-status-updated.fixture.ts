import {CharacterEntityProps} from '../../../rush-characters/domain/entity/character.entity';

export const updatedRushCharactersStatus: {
  id: string;
  characters: CharacterEntityProps[];
} = {
  id: 'rush-1234',
  characters: [
    {
      characterId: 'p1',
      playerName: 'Baldor',
      characterName: 'Baldor',
      team: 'KTV',
      mapId: 1,
      classId: 4,
      moneyInCopper: 500, // Earned golds
      level: 5,
      isDead: false,
      itemIds: [101, 102],
      lastUpdate: 1633073000,
      professions: [{professionId: 7, level: 10}],
    },
    {
      characterId: 'p2',
      playerName: 'Alarin',
      characterName: 'Alarin',
      team: 'JL',
      mapId: 10, // Changed zone
      classId: 3,
      moneyInCopper: 240, // Lost golds
      level: 9, // Leveled up
      isDead: false,
      itemIds: [], // Removed previous items
      lastUpdate: 1632986500,
      professions: [{professionId: 8, level: 50}], // Learned new profession
    },
    {
      characterId: 'p3',
      playerName: 'Kylora',
      characterName: 'Kylita', // Renamed
      team: 'JL', // Changed team
      classId: 5,
      mapId: 1,
      moneyInCopper: 320,
      level: 3,
      isDead: false,
      itemIds: [],
      lastUpdate: 1632910000,
      professions: [], // Forgot previous professions
    },
    {
      characterId: 'p4',
      playerName: 'Ragnar',
      characterName: 'Ragnar',
      team: 'JL',
      mapId: 1,
      classId: 2,
      moneyInCopper: 780,
      level: 10,
      isDead: true, // Dead
      itemIds: [104, 105],
      lastUpdate: 1632813700,
      professions: [{professionId: 1, level: 20}],
    },
    {
      characterId: 'p5',
      playerName: 'Thorin',
      characterName: 'Thorin',
      team: 'KTV',
      mapId: 1,
      classId: 1,
      moneyInCopper: 150,
      level: 4,
      isDead: false,
      itemIds: [106, 115], // Equipped new item
      lastUpdate: 1632727500,
      professions: [{professionId: 9, level: 45}], // Learned new profession
    },
    {
      characterId: 'p6',
      playerName: 'Eragon',
      characterName: 'Eragon',
      team: 'JL',
      mapId: 1,
      classId: 4,
      moneyInCopper: 1000, // Earned golds
      level: 7, // Leveled up
      isDead: false,
      itemIds: [107], // Removed previous item
      lastUpdate: 1632640900,
      professions: [{professionId: 5, level: 15}],
    },
    {
      characterId: 'p7',
      playerName: 'Arwen',
      characterName: 'Arwen',
      team: 'KTV',
      mapId: 1,
      classId: 3,
      moneyInCopper: 450,
      level: 7,
      isDead: false,
      itemIds: [109, 116], // Equipped new item
      lastUpdate: 1632554500,
      professions: [{professionId: 6, level: 40}], // Learned new profession
    },
    {
      characterId: 'p8',
      playerName: 'Gandalf',
      characterName: 'Gandalf',
      team: 'JL',
      mapId: 1,
      classId: 6,
      moneyInCopper: 890,
      level: 1,
      isDead: false,
      itemIds: [110], // Removed previous item
      lastUpdate: 1632468100,
      professions: [{professionId: 4, level: 25}],
    },
    {
      characterId: 'p9',
      playerName: 'Legolas',
      characterName: 'Legolas',
      team: 'KTV',
      mapId: 1,
      classId: 2,
      moneyInCopper: 300,
      level: 10, // Leveled up
      isDead: false,
      itemIds: [112],
      lastUpdate: 1632381700,
      professions: [],
    },
    {
      characterId: 'p10',
      playerName: 'Gimli',
      characterName: 'Gimli',
      team: 'JL',
      mapId: 1,
      classId: 7,
      moneyInCopper: 480,
      level: 2,
      isDead: false,
      itemIds: [113, 114],
      lastUpdate: 1632295300,
      professions: [{professionId: 2, level: 30}],
    },
    {
      characterId: 'p11',
      playerName: 'Frodo', // New character
      characterName: 'Frodo',
      team: 'KTV',
      mapId: 1,
      classId: 5,
      moneyInCopper: 200,
      level: 2,
      isDead: false,
      itemIds: [118],
      lastUpdate: 1632198900,
      professions: [{professionId: 3, level: 18}],
    },
  ],
};
