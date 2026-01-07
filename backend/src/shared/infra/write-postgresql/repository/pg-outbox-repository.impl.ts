import {In, Repository} from 'typeorm';
import {OutboxModel} from '../model/outbox.model';
import {WriteDatabaseService} from '../init';
import {Logger} from '../../logger/logger';
import {IntegrationEvent} from '../../../app/event/integration-event';
import {Traceable} from '../../logger/trace/decorator/trace-event-store-decorator';
import {OutboxStore} from '../../../domain/port/outbox-store.port';

export class PgOutboxRepository implements OutboxStore {
  private repo: Repository<OutboxModel>;
  constructor(databaseService: WriteDatabaseService) {
    this.repo = databaseService.getRepository(OutboxModel);
    Logger.info('outbox store repository initialized');
  }

  async getPendingEvents(): Promise<IntegrationEvent[]> {
    const events = await this.repo.find({
      where: {status: 'pending'},
    });
    return events.map(event => ({
      eventId: event.eventId,
      type: event.eventType,
      payload: event.payload,
      occuredAt: event.createdAt,
      correlationId: event.eventId,
    }));
  }

  @Traceable()
  async save(event: IntegrationEvent): Promise<void> {
    await this.repo.save({
      eventId: event.eventId,
      eventType: event.type,
      payload: event.payload,
      createdAt: event.occuredAt,
      status: 'pending',
    });
  }

  async getAcknowledgedEvents(types: string[]): Promise<IntegrationEvent[]> {
    const events = await this.repo.find({
      where: {status: 'acknowledged', eventType: In(types)},
    });
    return events.map(event => ({
      eventId: event.eventId,
      type: event.eventType,
      payload: event.payload,
      occuredAt: event.createdAt,
      correlationId: event.eventId,
    }));
  }

  async acknowledge(events: IntegrationEvent[]): Promise<void> {
    const eventIds = events.map(e => e.eventId);
    await this.repo.delete({eventId: In(eventIds)});
  }
}
