import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';
import ContainerManager from '../../../shared/infra/inversify/container-manager';
import {TYPES} from '../../../shared/infra/inversify/type';
import {publicProcedure, router} from '../../../shared/infra/trpc/trpc';
import {CleanRushFraud} from '../../app/command/clean-rush-fraud';
import {CloseRushFraud} from '../../app/command/close-rush-fraud';
import {CreateRushFraud} from '../../app/command/create-rush-fraud';
import {OpenRushFraud} from '../../app/command/open-rush-fraud';
import {RegisterRushFraudMail} from '../../app/command/register-rush-fraud-mail';
import {RegisterRushFraudTrade} from '../../app/command/register-rush-fraud-trade';
import {GetRushFraudHandler} from '../../app/query/get-rush-fraud.query';
import {RushFraudReadModel} from '../../domain/read-model/port/rush-fraud-read-model.port';
import {
  closeRushFraudSchema,
  getRushFraudSchema,
  outputSchema,
  registerRushFraudMailsSchema,
  registerRushFraudSchema,
  registerRushFraudTradesSchema,
} from '../zod/schema';

export const RushFraudAppRouter = router({
  registerRushFraud: publicProcedure
    .input(registerRushFraudSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const createRushFraudCommand = new CreateRushFraud(
        ContainerManager.get<EventStore>(TYPES.EventStore),
        ContainerManager.get<RushNameToIdRepository>(
          TYPES.RushNameToIdRepository,
        ),
      );
      await createRushFraudCommand.handle({
        rushId: input.rushId,
        name: input.name,
      });
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  closeRush: publicProcedure
    .input(closeRushFraudSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const closeRushFraudCommand = new CloseRushFraud(
        ContainerManager.get<EventStore>(TYPES.EventStore),
      );
      await closeRushFraudCommand.handle({rushId: input.rushId});
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  openRush: publicProcedure
    .input(closeRushFraudSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const openRushFraudCommand = new OpenRushFraud(
        ContainerManager.get<EventStore>(TYPES.EventStore),
      );
      await openRushFraudCommand.handle({rushId: input.rushId});
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  registerRushFraudEmail: publicProcedure
    .input(registerRushFraudMailsSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const registerRushFraudMailCommand = new RegisterRushFraudMail(
        ContainerManager.get<EventStore>(TYPES.EventStore),
      );
      await registerRushFraudMailCommand.handle({
        rushId: input.rushId,
        mail: input.mails,
      });
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  registerRushFraudTrade: publicProcedure
    .input(registerRushFraudTradesSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const registerRushFraudTradeCommand = new RegisterRushFraudTrade(
        ContainerManager.get<EventStore>(TYPES.EventStore),
      );
      await registerRushFraudTradeCommand.handle({
        rushId: input.rushId,
        trade: input.trades,
      });
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  cleanUpRush: publicProcedure
    .input(closeRushFraudSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const cleanUpRushFraudCommand = new CleanRushFraud(
        ContainerManager.get<EventStore>(TYPES.EventStore),
      );
      await cleanUpRushFraudCommand.handle({rushId: input.rushId});
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  getRushFraud: publicProcedure
    .input(getRushFraudSchema)
    .query(async ({input}) => {
      const getRushFraudHandler = new GetRushFraudHandler(
        ContainerManager.get<RushFraudReadModel>(TYPES.RushFraudReadModel),
        ContainerManager.get<RushNameToIdRepository>(
          TYPES.RushNameToIdRepository,
        ),
      );
      const rushFraud = await getRushFraudHandler.handle({
        rushName: input.rushName,
      });
      return {
        success: true,
        message: 'ok',
        data: rushFraud,
      };
    }),
});
