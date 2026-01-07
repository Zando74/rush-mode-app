import {BaseEsRootAggregate} from '../../../shared/domain/entity/base-es-root-aggregate';
import {RushAlreadyClosedError} from '../../../shared/domain/error/rush-already-closed.error';
import {RushAlreadyOpenError} from '../../../shared/domain/error/rush-already-open.error';
import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {RushFraudId} from '../../../shared/domain/value-object/rush-id';
import {
  RushFraudClosedEvent,
  RushFraudClosedEventType,
} from '../event/rush-fraud-closed-events';
import {
  RushFraudCreatedEvent,
  RushFraudCreatedEventType,
} from '../event/rush-fraud-created-event';
import {
  RushFraudMailRegisteredEvent,
  RushFraudMailRegisteredEventType,
} from '../event/rush-fraud-mail-registered-event';
import {
  RushFraudOpenedEvent,
  RushFraudOpenedEventType,
} from '../event/rush-fraud-opened-events';
import {
  RushFraudTradeRegisteredEvent,
  RushFraudTradeRegisteredEventType,
} from '../event/rush-fraud-trade-registered-event';
import {MailEntity, MailEntityProps} from './mail.entity';
import {TradeEntity, TradeEntityProps} from './trade.entity';

export interface RushFraudSnapshotState {
  rushName: string;
  mails: MailEntityProps[];
  trades: TradeEntityProps[];
  open: boolean;
}

export const RushFraudAggregateType = 'RushFraudAggregate';

export class RushFraudAggregate extends BaseEsRootAggregate<RushFraudSnapshotState> {
  id: RushFraudId;
  rushName: string;
  mails: MailEntity[];
  trades: TradeEntity[];
  open: boolean;

  public constructor() {
    super();
    this.on(RushFraudCreatedEventType, event =>
      this.onRushFraudCreated(event as RushFraudCreatedEvent),
    );
    this.on(RushFraudMailRegisteredEventType, event =>
      this.onRushFraudMailRegistered(event as RushFraudMailRegisteredEvent),
    );
    this.on(RushFraudTradeRegisteredEventType, event =>
      this.onRushFraudTradeRegistered(event as RushFraudTradeRegisteredEvent),
    );
    this.on(RushFraudClosedEventType, () => this.onRushFraudClosed());
    this.on(RushFraudOpenedEventType, () => this.onRushFraudOpened());
  }

  /* --------------------- SERIALIZATION --------------------- */
  protected serialize(): RushFraudSnapshotState {
    return {
      rushName: this.rushName,
      mails: this.mails.map(c => c.toSnapshot()),
      trades: this.trades.map(c => c.toSnapshot()),
      open: this.open,
    };
  }

  protected deserialize(state: RushFraudSnapshotState) {
    this.rushName = state.rushName;
    this.mails = state.mails.map(c => new MailEntity(c));
    this.trades = state.trades.map(c => new TradeEntity(c));
    this.open = state.open;
  }

  /* --------------------- CREATION --------------------- */
  createEvent(id: string, name: string): DomainEvent {
    return new RushFraudCreatedEvent(new RushFraudId(id), {name});
  }

  /*  -------------------- INVARIANTS -------------------- */
  public registerMailFraud(mails: MailEntity[]) {
    if (!this.open) {
      throw new RushAlreadyClosedError(this.rushName);
    }
    for (const mail of mails) {
      if (this.mails.find(m => m.hash === mail.hash)) {
        continue;
      }
      this.raise(
        new RushFraudMailRegisteredEvent(this.id, {mail: mail.toSnapshot()}),
      );
    }
    return this.uncommitted;
  }

  public registerTradeFraud(trades: TradeEntity[]) {
    if (!this.open) {
      throw new RushAlreadyClosedError(this.rushName);
    }
    for (const trade of trades) {
      if (this.trades.find(t => t.hash === trade.hash)) {
        continue;
      }
      this.raise(
        new RushFraudTradeRegisteredEvent(this.id, {trade: trade.toSnapshot()}),
      );
    }
    return this.uncommitted;
  }

  public closeRushFraud() {
    if (this.open) {
      this.raise(new RushFraudClosedEvent(this.id, {}));
      return this.uncommitted;
    }
    throw new RushAlreadyClosedError(this.rushName);
  }

  public OpenRushFraud() {
    if (this.open) {
      throw new RushAlreadyOpenError(this.rushName);
    }
    this.raise(new RushFraudOpenedEvent(this.id, {}));
    return this.uncommitted;
  }

  /* -------------------- EVENT HANDLERS -------------------- */
  private onRushFraudCreated(event: RushFraudCreatedEvent) {
    this.id = event.aggregateId;
    this.rushName = event.payload.name;
    this.mails = [];
    this.trades = [];
    this.open = true;
  }

  private onRushFraudMailRegistered(event: RushFraudMailRegisteredEvent) {
    this.mails.push(new MailEntity(event.payload.mail));
  }

  private onRushFraudTradeRegistered(event: RushFraudTradeRegisteredEvent) {
    this.trades.push(new TradeEntity(event.payload.trade));
  }

  private onRushFraudClosed() {
    this.open = false;
  }

  private onRushFraudOpened() {
    this.open = true;
  }
}
