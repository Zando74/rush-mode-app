import {z} from 'zod';

const registerRushFraudSchema = z.object({
  rushId: z.string(),
  name: z.string(),
});

const closeRushFraudSchema = z.object({
  rushId: z.string(),
});

const getRushFraudSchema = z.object({
  rushName: z.string(),
});

const registerRushFraudMailsSchema = z.object({
  rushId: z.string(),
  mails: z.array(
    z.object({
      playerName: z.string(),
      sender: z.string(),
      goldTaken: z.number(),
      attachments: z.array(z.object({id: z.number(), quantity: z.number()})),
      timestamp: z.number(),
    }),
  ),
});

const registerRushFraudTradesSchema = z.object({
  rushId: z.string(),
  trades: z.array(
    z.object({
      playerName: z.string(),
      giver: z.string(),
      goldReceived: z.number(),
      items: z.array(z.object({id: z.number(), quantity: z.number()})),
      timestamp: z.number(),
    }),
  ),
});

const outputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.optional(z.any()),
});

export {
  registerRushFraudSchema,
  closeRushFraudSchema,
  registerRushFraudMailsSchema,
  registerRushFraudTradesSchema,
  getRushFraudSchema,
  outputSchema,
};
