import {z} from 'zod';

const registerRushCharactersSchema = z.object({
  rushId: z.string(),
  name: z.string(),
});

const updateRushCharactersStatusSchema = z.object({
  rushId: z.string(),
  characters: z.array(
    z.object({
      characterId: z.string(),
      playerName: z.string(),
      characterName: z.string(),
      team: z.string(),
      mapId: z.number(),
      classId: z.number(),
      moneyInCopper: z.number(),
      level: z.number(),
      isDead: z.boolean(),
      itemIds: z.array(z.number()),
      lastUpdate: z.number(),
      professions: z.array(
        z.object({
          professionId: z.number(),
          level: z.number(),
        }),
      ),
    }),
  ),
});

const closeRushCharactersSchema = z.object({
  rushId: z.string(),
});

const getRushCharactersEventsSchema = z.object({
  rushName: z.string(),
  from: z.date(),
  to: z.date(),
  isAdmin: z.boolean(),
});

const getRushCharactersSchema = z.object({
  rushName: z.string(),
});

const outputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.optional(z.any()),
});

export {
  registerRushCharactersSchema,
  updateRushCharactersStatusSchema,
  closeRushCharactersSchema,
  getRushCharactersEventsSchema,
  getRushCharactersSchema,
  outputSchema,
};
