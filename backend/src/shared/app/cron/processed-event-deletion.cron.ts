import {ProcessedEvent} from '../../domain/port/processed-event.port';
import {Logger} from '../../infra/logger/logger';
import {BaseCron} from './base-cron';

export class ProcessedEventDeletionCron extends BaseCron {
  constructor(private readonly processedEvent: ProcessedEvent) {
    super(Number(process.env.PROCESSED_EVENT_DELETION_INTERVAL));
  }

  async handle(): Promise<void> {
    try {
      const deletedEvents = await this.processedEvent.deleteOldEvents();
      if (deletedEvents.length === 0) {
        return;
      }
      Logger.info(
        deletedEvents.length + ' [PROCESSED-EVENT] - old events deleted',
      );
    } catch (e) {
      Logger.error(e, '[PROCESSED-EVENT] - Failed to delete old events');
    }
  }
}
