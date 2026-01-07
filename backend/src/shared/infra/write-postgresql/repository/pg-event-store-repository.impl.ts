import {MoreThan, QueryFailedError, Repository} from 'typeorm';
import {EventStoreModel} from '../model/event-store.model';
import {WriteDatabaseService} from '../init';
import {DomainEvent, EventPayload} from '../../../domain/event/domain-event';
import {ConcurrencyError} from '../../error/concurency-error';
import {PgSnapshotRepository} from './pg-snapshot-repository.impl';
import {SnapshotModel} from '../model/snapshot.model';
import {AggregateSnapshot} from '../../../domain/entity/base-es-root-aggregate';
import {Logger} from '../../logger/logger';
import {AggregateId} from '../../../domain/value-object/aggregate-id';
import {Traceable} from '../../logger/trace/decorator/trace-event-store-decorator';
import {OutboxModel} from '../model/outbox.model';
import {EventStore} from '../../../domain/port/event-store.port';
import {DomainEventBus} from '../../../domain/port/domain-event-bus';
import {AggregateUpdatedIntegrationEvent} from '../../../app/event/aggregate-updated-integration-event';
import {AuditLogModel} from '../model/audit-log.model';

export class PgEventStoreRepository implements EventStore {
  private repo: Repository<EventStoreModel>;

  constructor(
    databaseService: WriteDatabaseService,
    private readonly eventBus: DomainEventBus,
    private readonly snapshotRepository: PgSnapshotRepository,
  ) {
    this.repo = databaseService.getRepository(EventStoreModel);
    Logger.info('event store repository initialized');
  }

  @Traceable()
  async save<T>(
    aggregateId: AggregateId,
    events: DomainEvent[],
    aggregateStateAfterApply: AggregateSnapshot<T>,
    aggregateType: string,
  ): Promise<void> {
    await this.repo.manager.transaction(async transactionalEntityManager => {
      if (events.length === 0) {
        Logger.warn('event store called with empty events');
        return;
      }

      const eventRepository =
        transactionalEntityManager.getRepository(EventStoreModel);

      const auditLogRepository =
        transactionalEntityManager.getRepository(AuditLogModel);

      const lastEvent = await eventRepository.findOne({
        where: {identityHash: AggregateId.getIdentityHash(aggregateId)},
        order: {sequenceNumber: 'DESC'},
      });

      const sequenceNumber = lastEvent ? lastEvent.sequenceNumber : 0;
      if (sequenceNumber >= events[0].sequenceNumber) {
        throw new ConcurrencyError(
          '[CONCURRENCY]: sequence number provided is previous current state',
        );
      }

      const storedEvents: EventStoreModel[] = events.map(event => ({
        aggregateId: aggregateId,
        identityHash: AggregateId.getIdentityHash(aggregateId),
        type: event.type,
        boundedContext: event.boundedContext,
        payload: event.payload,
        sequenceNumber: event.sequenceNumber,
        occuredAt: new Date(),
      }));
      try {
        await eventRepository.save(storedEvents);
        await auditLogRepository.save(storedEvents);
      } catch (e) {
        if (e instanceof QueryFailedError) {
          if (e.driverError.code === '23505') {
            throw new ConcurrencyError(
              '[CONCURRENCY]: Already processed event',
            );
          }
        }
        throw e;
      }

      await this.eventBus.publish(events);

      const aggregateUpdatedEvent = new AggregateUpdatedIntegrationEvent(
        crypto.randomUUID(),
        {
          aggregateId: aggregateId,
        },
        events[0].correlationId,
        aggregateType,
      );

      const outboxStoreRepo =
        transactionalEntityManager.getRepository(OutboxModel);

      await outboxStoreRepo.save({
        eventId: aggregateUpdatedEvent.eventId,
        eventType: aggregateUpdatedEvent.type,
        payload: aggregateUpdatedEvent.payload,
        createdAt: aggregateUpdatedEvent.occuredAt,
        status: 'pending',
      });

      const lastEventSeqAfterBatch = events[events.length - 1].sequenceNumber;
      if (
        lastEventSeqAfterBatch - sequenceNumber >=
        Number(process.env.SNAPSHOT_FREQUENCY)
      ) {
        const snapshotRepo =
          transactionalEntityManager.getRepository(SnapshotModel);

        const snap = snapshotRepo.create({
          aggregateId: aggregateId,
          identityHash: AggregateId.getIdentityHash(aggregateId),
          data: aggregateStateAfterApply,
          lastSequenceNumber: events[events.length - 1].sequenceNumber,
          createdAt: new Date(),
        });

        await snapshotRepo.save(snap);
        Logger.info('[INFRA] - Snapshot created');
      }
    });
  }

  @Traceable()
  async loadFromLatestSnapshot<T>(
    aggregateId: AggregateId,
  ): Promise<{events: DomainEvent[]; snapshot?: AggregateSnapshot<T>}> {
    const snapshot = await this.snapshotRepository.getLastSnapshot(aggregateId);

    let storedEvents: EventStoreModel[];

    if (snapshot) {
      storedEvents = await this.repo.find({
        where: {
          identityHash: AggregateId.getIdentityHash(aggregateId),
          sequenceNumber: MoreThan(snapshot.lastSequenceNumber),
        },
        order: {sequenceNumber: 'ASC'},
      });
    } else {
      storedEvents = await this.repo.find({
        where: {identityHash: AggregateId.getIdentityHash(aggregateId)},
        order: {sequenceNumber: 'ASC'},
      });
    }

    const domainEvents: DomainEvent[] = storedEvents.map(evt => ({
      aggregateId: evt.aggregateId,
      sequenceNumber: evt.sequenceNumber,
      correlationId: '',
      type: evt.type,
      boundedContext: evt.boundedContext,
      payload: evt.payload,
      occuredAt: evt.occuredAt,
    }));

    return {
      events: domainEvents,
      snapshot: snapshot?.data as AggregateSnapshot<T>,
    };
  }

  @Traceable()
  async loadAllHistory(aggregateId: AggregateId): Promise<DomainEvent[]> {
    const storedEvents = await this.repo.find({
      where: {identityHash: AggregateId.getIdentityHash(aggregateId)},
      order: {sequenceNumber: 'ASC'},
    });

    const domainEvents: DomainEvent[] = storedEvents.map(evt => ({
      aggregateId: aggregateId,
      sequenceNumber: evt.sequenceNumber,
      correlationId: '',
      type: evt.type,
      boundedContext: evt.boundedContext,
      payload: evt.payload as EventPayload,
      occuredAt: evt.occuredAt,
    }));
    return domainEvents;
  }

  @Traceable()
  async delete(aggregateId: AggregateId): Promise<void> {
    await this.repo.manager.transaction(async transactionalEntityManager => {
      const eventRepository =
        transactionalEntityManager.getRepository(EventStoreModel);
      const auditLogRepository =
        transactionalEntityManager.getRepository(AuditLogModel);
      const snapshotRepo =
        transactionalEntityManager.getRepository(SnapshotModel);

      await eventRepository.delete({
        identityHash: AggregateId.getIdentityHash(aggregateId),
      });
      await snapshotRepo.delete({
        identityHash: AggregateId.getIdentityHash(aggregateId),
      });
      await auditLogRepository.delete({
        identityHash: AggregateId.getIdentityHash(aggregateId),
      });
    });
  }
}
