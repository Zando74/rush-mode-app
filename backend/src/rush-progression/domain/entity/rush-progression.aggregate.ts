import {BaseEsRootAggregate} from '../../../shared/domain/entity/base-es-root-aggregate';
import {RushAlreadyClosedError} from '../../../shared/domain/error/rush-already-closed.error';
import {RushAlreadyOpenError} from '../../../shared/domain/error/rush-already-open.error';
import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {RushProgressionId} from '../../../shared/domain/value-object/rush-id';
import {
  RushProgressionClosedEvent,
  RushProgressionClosedEventType,
} from '../event/rush-progression-closed-events';
import {
  RushProgressionCreatedEvent,
  RushProgressionCreatedEventType,
} from '../event/rush-progression-created-event';
import {
  RushProgressionOpenedEvent,
  RushProgressionOpenedEventType,
} from '../event/rush-progression-opened-events';
import {
  RushProgressionRegisteredEvent,
  RushProgressionRegisteredEventType,
} from '../event/rush-progression-registered-event';
import {ProgressionEntity, ProgressionEntityProps} from './progression.entity';

export interface RushProgressionSnapshotState {
  rushName: string;
  progressions: ProgressionEntityProps[];
  open: boolean;
}

export const RushProgressionAggregateType = 'RushProgressionAggregate';

export class RushProgressionAggregate extends BaseEsRootAggregate<RushProgressionSnapshotState> {
  id: RushProgressionId;
  rushName: string;
  progressions: ProgressionEntity[];
  open: boolean;

  public constructor() {
    super();
    this.on(RushProgressionCreatedEventType, event =>
      this.onRushProgressionCreated(event as RushProgressionCreatedEvent),
    );
    this.on(RushProgressionRegisteredEventType, event =>
      this.onRushProgressionRegistered(event as RushProgressionRegisteredEvent),
    );
    this.on(RushProgressionClosedEventType, () =>
      this.onRushProgressionClosed(),
    );
    this.on(RushProgressionOpenedEventType, () =>
      this.onRushProgressionOpened(),
    );
  }

  /* --------------------- SERIALIZATION --------------------- */
  protected serialize(): RushProgressionSnapshotState {
    return {
      rushName: this.rushName,
      progressions: this.progressions.map(p => p.toSnapshot()),
      open: this.open,
    };
  }

  protected deserialize(state: RushProgressionSnapshotState) {
    this.rushName = state.rushName;
    this.progressions = state.progressions.map(p => new ProgressionEntity(p));
    this.open = state.open;
  }

  /* --------------------- CREATION --------------------- */
  createEvent(id: string, name: string): DomainEvent {
    return new RushProgressionCreatedEvent(new RushProgressionId(id), {name});
  }

  /*  -------------------- INVARIANTS -------------------- */
  public registerProgression(progressions: ProgressionEntityProps[]) {
    if (!this.open) {
      throw new RushAlreadyClosedError(this.rushName);
    }
    for (const {playerName, achievements} of progressions) {
      const existingProgression = this.progressions.find(
        p => p.playerName === playerName,
      );
      for (const achievement of achievements) {
        if (
          existingProgression &&
          existingProgression.achievements.includes(achievement)
        ) {
          continue;
        }
        this.raise(
          new RushProgressionRegisteredEvent(this.id, {
            playerName,
            achievement: achievement,
          }),
        );
      }
    }
    return this.uncommitted;
  }

  public closeRushProgression() {
    if (this.open) {
      this.raise(new RushProgressionClosedEvent(this.id, {}));
      return this.uncommitted;
    }
    throw new RushAlreadyClosedError(this.rushName);
  }

  public openRushProgression() {
    if (this.open) {
      throw new RushAlreadyOpenError(this.rushName);
    }
    this.raise(new RushProgressionOpenedEvent(this.id, {}));
    return this.uncommitted;
  }

  /* -------------------- EVENT HANDLERS -------------------- */
  private onRushProgressionCreated(event: RushProgressionCreatedEvent) {
    this.id = event.aggregateId;
    this.rushName = event.payload.name;
    this.progressions = [];
    this.open = true;
  }

  private onRushProgressionRegistered(event: RushProgressionRegisteredEvent) {
    const existingProgression = this.progressions.find(
      p => p.playerName === event.payload.playerName,
    );
    if (existingProgression) {
      existingProgression.achievements.push(event.payload.achievement);
      return;
    }
    this.progressions.push(
      new ProgressionEntity({
        playerName: event.payload.playerName,
        achievements: [event.payload.achievement],
      }),
    );
  }

  private onRushProgressionClosed() {
    this.open = false;
  }

  private onRushProgressionOpened() {
    this.open = true;
  }
}
