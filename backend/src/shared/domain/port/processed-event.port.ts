import {ProcessedEventModel} from '../../infra/write-postgresql/model/processed-event.model';

export interface ProcessedEvent {
  save(eventId: string): Promise<void>;
  findAllProcessedEvents(): Promise<ProcessedEventModel[]>;
  isAlreadyProcessedEvent(eventId: string): Promise<boolean>;
  deleteOldEvents(): Promise<ProcessedEventModel[]>;
}
