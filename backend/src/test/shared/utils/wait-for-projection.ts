import {OutboxStore} from '../../../shared/domain/port/outbox-store.port';
import {ProcessedEvent} from '../../../shared/domain/port/processed-event.port';
import ContainerManager from '../../../shared/infra/inversify/container-manager';
import {TYPES} from '../../../shared/infra/inversify/type';

export async function waitForProjectionToBeUpToDate(
  projectionsTypeEvents: string[],
  timeout = 3000,
) {
  const start = Date.now();

  const outboxRepo = ContainerManager.get<OutboxStore>(TYPES.OutboxStore);
  const processedEventRepo = ContainerManager.get<ProcessedEvent>(
    TYPES.ProcessedEvent,
  );

  let projectionIsUpToDate = false;
  while (!projectionIsUpToDate) {
    const pendingEvents = (await outboxRepo.getPendingEvents()).filter(e =>
      projectionsTypeEvents.includes(e.type),
    );
    const sendedEvents = await outboxRepo.getAcknowledgedEvents(
      projectionsTypeEvents,
    );
    const processedEvents = await processedEventRepo.findAllProcessedEvents();

    if (
      pendingEvents.length === 0 &&
      sendedEvents.every(e =>
        processedEvents.map(p => p.id).includes(e.eventId),
      )
    ) {
      projectionIsUpToDate = true;
    }

    if (Date.now() - start > timeout) {
      throw new Error(`Projection not up-to-date after ${timeout}ms.`);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
