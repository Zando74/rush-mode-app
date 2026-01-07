import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';
import {AuditLog} from '../../../shared/domain/port/audit-log.port';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {RushCharactersEventsReadState} from '../../domain/read-model/read-state/rush-characters-events-read-state';

export interface GetRushCharactersEventsQuery {
  rushName: string;
  from: Date;
  to: Date;
}

export class GetRushCharactersEventsHandler {
  constructor(
    private auditLogRepository: AuditLog,
    private rushToIdRepository: RushNameToIdRepository,
  ) {}

  async handle(
    query: GetRushCharactersEventsQuery,
  ): Promise<RushCharactersEventsReadState[]> {
    const rushId = await this.rushToIdRepository.getRushIdByName(
      query.rushName,
    );
    if (!rushId) {
      throw new RushNotFoundError(query.rushName);
    }
    const events = await this.auditLogRepository.findByAggregateId(
      new RushCharactersId(rushId.rushId),
      query.from,
      query.to,
    );
    const rushCharactersEvents: RushCharactersEventsReadState[] = [];
    for (const event of events) {
      if (event.payload.characterId) {
        if (
          !rushCharactersEvents.some(
            e => e.characterId === event.payload.characterId,
          )
        ) {
          rushCharactersEvents.push({
            characterId: event.payload.characterId as string,
            events: [
              {
                type: event.type,
                data: event.payload,
                sequenceNumber: event.sequenceNumber,
                at: event.occuredAt,
              },
            ],
          });
        } else {
          rushCharactersEvents
            .find(e => e.characterId === event.payload.characterId)!
            .events.push({
              type: event.type,
              data: event.payload,
              sequenceNumber: event.sequenceNumber,
              at: event.occuredAt,
            });
        }
      }
      for (const rushCharacterEvent of rushCharactersEvents) {
        rushCharacterEvent.events.sort(
          (a, b) => a.sequenceNumber - b.sequenceNumber,
        );
      }
    }

    return rushCharactersEvents;
  }
}
