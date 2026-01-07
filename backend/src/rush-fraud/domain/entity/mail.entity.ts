import {createHash} from 'crypto';
import {MissingFieldError} from '../../../shared/domain/error/missing-field.error';

export interface ItemAttachment {
  id: number;
  quantity: number;
}

export interface MailEntityProps {
  playerName: string;
  sender: string;
  goldTaken: number;
  attachments: ItemAttachment[];
  timestamp: number;
}

export class MailEntity {
  playerName: string;
  sender: string;
  goldTaken: number;
  attachments: ItemAttachment[];
  timestamp: number;
  hash: string;

  constructor(props: MailEntityProps) {
    this.isValidProps(props);
    this.playerName = props.playerName;
    this.sender = props.sender;
    this.goldTaken = props.goldTaken;
    this.attachments = props.attachments;
    this.timestamp = props.timestamp;
    this.hash = this.toHash();
  }

  toSnapshot(): MailEntityProps {
    return {
      playerName: this.playerName,
      sender: this.sender,
      goldTaken: this.goldTaken,
      attachments: this.attachments,
      timestamp: this.timestamp,
    };
  }

  private toHash(): string {
    const props = this.toSnapshot();
    props.attachments = props.attachments.sort((a, b) => a.id - b.id);
    return createHash('sha256').update(JSON.stringify(props)).digest('hex');
  }

  private isValidProps(props: MailEntityProps) {
    if (props.playerName === undefined) {
      throw new MissingFieldError('playerName is required');
    }
    if (props.sender === undefined) {
      throw new MissingFieldError('sender is required');
    }
    if (props.goldTaken === undefined) {
      throw new MissingFieldError('goldTaken is required');
    }
    if (props.attachments === undefined) {
      throw new MissingFieldError('attachments is required');
    }
    if (props.timestamp === undefined) {
      throw new MissingFieldError('timestamp is required');
    }
  }
}
