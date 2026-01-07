/* eslint-disable n/no-unpublished-import */
import ContainerManager from '../../../shared/infra/inversify/container-manager';
import {TYPES} from '../../../shared/infra/inversify/type';
import {IntegrationEventDispatcherCron} from '../../../shared/app/cron/integration-event-dispatcher.cron';
import {RushCharactersReadModel} from '../../../rush-characters/domain/read-model/port/rush-characters-read-model.port';
import {RushCharactersAggregateType} from '../../../rush-characters/domain/entity/rush-characters.aggregate';
import {InlineProjectionHandler} from '../../../shared/domain/read-model/port/inline-projection-handler.port';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import {OutboxStore} from '../../../shared/domain/port/outbox-store.port';
import {CharacterEntityProps} from '../../../rush-characters/domain/entity/character.entity';
import {waitForProjectionToBeUpToDate} from '../../shared/utils/wait-for-projection';
import {AuditLog} from '../../../shared/domain/port/audit-log.port';
import {RushCharactersAppRouter} from '../../../rush-characters/infra/trpc/app';
import {createCallerFactory} from '../../../shared/infra/trpc/trpc';

export class RushCharactersWorld {
  rushCharactersReadModel: RushCharactersReadModel;
  rushCharactersProjectionHandler: InlineProjectionHandler;
  eventStore: EventStore;
  auditLogRepository: AuditLog;
  outbox: OutboxStore;

  constructor() {}

  public reloadInfraRepositories() {
    this.eventStore = ContainerManager.get<EventStore>(TYPES.EventStore);
    this.auditLogRepository = ContainerManager.get<AuditLog>(
      TYPES.AuditLogRepository,
    );
    this.rushCharactersReadModel =
      ContainerManager.get<RushCharactersReadModel>(
        TYPES.RushCharactersReadModel,
      );
    this.outbox = ContainerManager.get<OutboxStore>(TYPES.OutboxStore);
  }

  public async HandleIntegrationEventDispatcher() {
    await ContainerManager.get<IntegrationEventDispatcherCron>(
      TYPES.IntegrationEventDispatcherCron,
    ).handle();
  }

  async getRushCharacters(rushName: string) {
    await this.HandleIntegrationEventDispatcher();
    await waitForProjectionToBeUpToDate([RushCharactersAggregateType]);
    const createCaller = createCallerFactory(RushCharactersAppRouter);
    const caller = createCaller({});
    return await caller.getRushCharacters({rushName});
  }

  async getRushCharactersEvents(rushName: string, from: Date, to: Date) {
    const createCaller = createCallerFactory(RushCharactersAppRouter);
    const caller = createCaller({});
    const events = await caller.getRushCharactersEvent({
      rushName,
      from,
      to,
      isAdmin: true,
    });
    return events;
  }

  async registerRushCharacters(rushId: string, name: string) {
    const createCaller = createCallerFactory(RushCharactersAppRouter);
    const caller = createCaller({});
    await caller.registerRushCharacter({rushId, name});
  }

  async closeRushCharacters(rushId: string) {
    const createCaller = createCallerFactory(RushCharactersAppRouter);
    const caller = createCaller({});
    await caller.closeRush({rushId});
  }

  async cleanUpRushCharacters(rushId: string) {
    const createCaller = createCallerFactory(RushCharactersAppRouter);
    const caller = createCaller({});
    await caller.cleanUpRush({rushId});
  }

  async processRushCharactersUpdateStatus(
    rushId: string,
    characters: CharacterEntityProps[],
  ) {
    const createCaller = createCallerFactory(RushCharactersAppRouter);
    const caller = createCaller({});
    await caller.playerStatusUpdate({
      rushId: rushId,
      characters,
    });
  }
}
