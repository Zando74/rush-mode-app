import {z} from 'zod';

const createRushProgressionSchema = z.object({
  rushId: z.string(),
  name: z.string(),
});

const closeRushProgressionSchema = z.object({
  rushId: z.string(),
});

const getRushProgressionSchema = z.object({
  rushName: z.string(),
});

const registerRushProgressionSchema = z.object({
  rushId: z.string(),
  progressions: z.array(
    z.object({
      playerName: z.string(),
      achievements: z.array(z.string()),
    }),
  ),
});

const outputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.optional(z.any()),
});

export {
  createRushProgressionSchema,
  registerRushProgressionSchema,
  closeRushProgressionSchema,
  getRushProgressionSchema,
  outputSchema,
};
