import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';
import ContainerManager from '../../../shared/infra/inversify/container-manager';
import {TYPES} from '../../../shared/infra/inversify/type';
import {publicProcedure, router} from '../../../shared/infra/trpc/trpc';
import {CleanRushProgression} from '../../app/command/clean-rush-progression';
import {CloseRushProgression} from '../../app/command/close-rush-progression';
import {CreateRushProgression} from '../../app/command/create-rush-progression';
import {OpenRushProgression} from '../../app/command/open-rush-progression';
import {RegisterRushProgression} from '../../app/command/register-rush-progression';
import {GetRushProgressionHandler} from '../../app/query/get-rush-progression.query';
import {RushProgressionReadModel} from '../../domain/read-model/port/rush-progression-read-model.port';
import {
  closeRushProgressionSchema,
  createRushProgressionSchema,
  getRushProgressionSchema,
  outputSchema,
  registerRushProgressionSchema,
} from '../zod/schema';

export const RushProgressionAppRouter = router({
  registerRushProgression: publicProcedure
    .input(createRushProgressionSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const createRushProgressionCommand = new CreateRushProgression(
        ContainerManager.get<EventStore>(TYPES.EventStore),
        ContainerManager.get<RushNameToIdRepository>(
          TYPES.RushNameToIdRepository,
        ),
      );
      await createRushProgressionCommand.handle({
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
    .input(closeRushProgressionSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const closeRushProgressionCommand = new CloseRushProgression(
        ContainerManager.get<EventStore>(TYPES.EventStore),
      );
      await closeRushProgressionCommand.handle({rushId: input.rushId});
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  openRush: publicProcedure
    .input(closeRushProgressionSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const openRushProgressionCommand = new OpenRushProgression(
        ContainerManager.get<EventStore>(TYPES.EventStore),
      );
      await openRushProgressionCommand.handle({rushId: input.rushId});
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  cleanUpRush: publicProcedure
    .input(closeRushProgressionSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const cleanUpRushProgressionCommand = new CleanRushProgression(
        ContainerManager.get<EventStore>(TYPES.EventStore),
      );
      await cleanUpRushProgressionCommand.handle({rushId: input.rushId});
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  getRushProgression: publicProcedure
    .input(getRushProgressionSchema)
    .query(async ({input}) => {
      const getRushProgressionHandler = new GetRushProgressionHandler(
        ContainerManager.get<RushProgressionReadModel>(
          TYPES.RushProgressionReadModel,
        ),
        ContainerManager.get<RushNameToIdRepository>(
          TYPES.RushNameToIdRepository,
        ),
      );
      const rushProgression = await getRushProgressionHandler.handle({
        rushName: input.rushName,
      });
      return {
        success: true,
        message: 'ok',
        data: rushProgression,
      };
    }),

  registerRushProgressionEvents: publicProcedure
    .input(registerRushProgressionSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const registerRushProgressionCommand = new RegisterRushProgression(
        ContainerManager.get<EventStore>(TYPES.EventStore),
      );
      await registerRushProgressionCommand.handle({
        rushId: input.rushId,
        progressions: input.progressions,
      });
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),
});
