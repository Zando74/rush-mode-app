import {createHash} from 'crypto';
import {MissingFieldError} from '../../../shared/domain/error/missing-field.error';
import {ItemAttachment} from './mail.entity';

export interface TradeEntityProps {
  playerName: string;
  giver: string;
  goldReceived: number;
  items: ItemAttachment[];
  timestamp: number;
}

export class TradeEntity {
  playerName: string;
  giver: string;
  goldReceived: number;
  items: ItemAttachment[];
  timestamp: number;
  hash: string;

  constructor(props: TradeEntityProps) {
    this.isValidProps(props);
    this.playerName = props.playerName;
    this.giver = props.giver;
    this.goldReceived = props.goldReceived;
    this.items = props.items;
    this.timestamp = props.timestamp;
    this.hash = this.toHash();
  }

  toSnapshot(): TradeEntityProps {
    return {
      playerName: this.playerName,
      giver: this.giver,
      goldReceived: this.goldReceived,
      items: this.items,
      timestamp: this.timestamp,
    };
  }

  private toHash(): string {
    const props = this.toSnapshot();
    props.items = props.items.sort((a, b) => a.id - b.id);
    return createHash('sha256').update(JSON.stringify(props)).digest('hex');
  }

  private isValidProps(props: TradeEntityProps) {
    if (props.playerName === undefined) {
      throw new MissingFieldError('playerName is required');
    }
    if (props.giver === undefined) {
      throw new MissingFieldError('giver is required');
    }
    if (props.goldReceived === undefined) {
      throw new MissingFieldError('goldReceived is required');
    }
    if (props.items === undefined) {
      throw new MissingFieldError('items is required');
    }
    if (props.timestamp === undefined) {
      throw new MissingFieldError('timestamp is required');
    }
  }
}
