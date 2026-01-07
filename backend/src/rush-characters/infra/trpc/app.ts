import {publicProcedure, router} from '../../../shared/infra/trpc/trpc';
import {
  closeRushCharactersSchema,
  getRushCharactersEventsSchema,
  getRushCharactersSchema,
  outputSchema,
  registerRushCharactersSchema,
  updateRushCharactersStatusSchema,
} from '../zod/schema';
import ContainerManager from '../../../shared/infra/inversify/container-manager';
import {CreateRushCharacters} from '../../app/command/create-rush-characters';
import {TYPES} from '../../../shared/infra/inversify/type';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import {ProcessRushCharactersUpdateStatus} from '../../app/command/process-rush-characters-update-status';
import {CloseRushCharacters} from '../../app/command/close-rush-characters';
import {CleanRushCharacters} from '../../app/command/clean-rush-characters';
import {GetRushCharactersHandler} from '../../app/query/get-rush-characters.query';
import {RushCharactersReadModel} from '../../domain/read-model/port/rush-characters-read-model.port';
import {GetRushCharactersEventsHandler} from '../../app/query/get-rush-characters-events.query';
import {AuditLog} from '../../../shared/domain/port/audit-log.port';
import {OpenRushCharacters} from '../../app/command/open-rush-characters';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';
import {GetRushNamesHandler} from '../../app/query/get-rush-names.query';

export const RushCharactersAppRouter = router({
  registerRushCharacter: publicProcedure
    .input(registerRushCharactersSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const createRushCharactersCommand = new CreateRushCharacters(
        ContainerManager.get<EventStore>(TYPES.EventStore),
        ContainerManager.get<RushNameToIdRepository>(
          TYPES.RushNameToIdRepository,
        ),
      );
      await createRushCharactersCommand.handle({
        rushId: input.rushId,
        name: input.name,
      });
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  playerStatusUpdate: publicProcedure
    .input(updateRushCharactersStatusSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const processRushCharactersUpdateStatusCommand =
        new ProcessRushCharactersUpdateStatus(
          ContainerManager.get<EventStore>(TYPES.EventStore),
        );
      await processRushCharactersUpdateStatusCommand.handle({
        rushId: input.rushId,
        characters: input.characters,
      });
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  closeRush: publicProcedure
    .input(closeRushCharactersSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const closeRushCharactersCommand = new CloseRushCharacters(
        ContainerManager.get<EventStore>(TYPES.EventStore),
      );
      await closeRushCharactersCommand.handle({rushId: input.rushId});
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  openRush: publicProcedure
    .input(closeRushCharactersSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const openRushCharactersCommand = new OpenRushCharacters(
        ContainerManager.get<EventStore>(TYPES.EventStore),
      );
      await openRushCharactersCommand.handle({rushId: input.rushId});
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  cleanUpRush: publicProcedure
    .input(closeRushCharactersSchema)
    .output(outputSchema)
    .mutation(async opts => {
      const {input} = opts;
      const cleanUpRushCharactersCommand = new CleanRushCharacters(
        ContainerManager.get<EventStore>(TYPES.EventStore),
        ContainerManager.get<RushNameToIdRepository>(
          TYPES.RushNameToIdRepository,
        ),
      );
      await cleanUpRushCharactersCommand.handle({rushId: input.rushId});
      return {
        success: true,
        message: 'ok',
        data: undefined,
      };
    }),

  getRushCharacters: publicProcedure
    .input(getRushCharactersSchema)
    .query(async ({input}) => {
      const getRushCharactersHandler = new GetRushCharactersHandler(
        ContainerManager.get<RushCharactersReadModel>(
          TYPES.RushCharactersReadModel,
        ),
        ContainerManager.get<RushNameToIdRepository>(
          TYPES.RushNameToIdRepository,
        ),
      );
      const rushCharacters = await getRushCharactersHandler.handle({
        rushName: input.rushName,
      });
      return {
        success: true,
        message: 'ok',
        data: rushCharacters,
      };
    }),

  getRushCharactersEvent: publicProcedure
    .input(getRushCharactersEventsSchema)
    .query(async ({input}) => {
      const getRushCharactersHandler = new GetRushCharactersEventsHandler(
        ContainerManager.get<AuditLog>(TYPES.AuditLogRepository),
        ContainerManager.get<RushNameToIdRepository>(
          TYPES.RushNameToIdRepository,
        ),
      );

      const delta = input.from.getTime() - input.to.getTime();
      if (delta > 3 * 60 * 60 * 1000 && !input.isAdmin) {
        return {
          success: false,
          message: 'from and to delta must be less than 3 hours',
          data: [],
        };
      }

      const rushCharacters = await getRushCharactersHandler.handle({
        rushName: input.rushName,
        from: input.from,
        to: input.to,
      });
      return {
        success: true,
        message: 'ok',
        data: rushCharacters,
      };
    }),

  getRushNames: publicProcedure.query(async ({}) => {
    const getRushNamesHandler = new GetRushNamesHandler(
      ContainerManager.get<RushNameToIdRepository>(
        TYPES.RushNameToIdRepository,
      ),
    );
    const rushNames = await getRushNamesHandler.handle({});
    return {
      success: true,
      message: 'ok',
      data: rushNames,
    };
  }),
});
