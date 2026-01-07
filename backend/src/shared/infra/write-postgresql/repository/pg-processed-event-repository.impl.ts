import {In, LessThan, Repository} from 'typeorm';
import {ProcessedEventModel} from '../model/processed-event.model';
import {WriteDatabaseService} from '../init';
import {Logger} from '../../logger/logger';
import {ProcessedEvent} from '../../../domain/port/processed-event.port';

export class PgProcessedEventRepository implements ProcessedEvent {
  private repo: Repository<ProcessedEventModel>;

  constructor(databaseService: WriteDatabaseService) {
    this.repo = databaseService.getRepository(ProcessedEventModel);
    Logger.info('Processed event repository initialized');
  }

  async save(eventId: string): Promise<void> {
    await this.repo.upsert(
      {
        id: eventId,
      },
      ['id'],
    );
  }

  findAllProcessedEvents(): Promise<ProcessedEventModel[]> {
    return this.repo.find({});
  }

  async isAlreadyProcessedEvent(eventId: string): Promise<boolean> {
    const lastEvent = await this.repo.findOne({where: {id: eventId}});
    return lastEvent !== null;
  }

  async deleteOldEvents(): Promise<ProcessedEventModel[]> {
    const events = await this.repo.find({
      where: {
        createdAt: LessThan(
          new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
        ),
      },
    });
    await this.repo.delete({id: In(events.map(e => e.id))});
    return events;
  }
}
