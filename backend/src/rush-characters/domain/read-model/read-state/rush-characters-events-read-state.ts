import {EventPayload} from '../../../../shared/domain/event/domain-event';

export type RushCharactersEventsReadState = {
  characterId: string;
  events: {
    type: string;
    data: EventPayload;
    sequenceNumber: number;
    at: Date;
  }[];
};
