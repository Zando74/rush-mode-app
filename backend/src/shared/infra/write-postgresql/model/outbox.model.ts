import {Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {EventPayload} from '../../../domain/event/domain-event';

@Entity('outbox')
@Unique('PK_OUTBOX_EVENT_ID', ['eventId'])
export class OutboxModel {
  @PrimaryGeneratedColumn({primaryKeyConstraintName: 'PK_OUTBOX_ID'})
  id!: number;

  @Column()
  eventType!: string;

  @Column('jsonb')
  payload!: EventPayload;

  @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  createdAt!: Date;

  @Column()
  eventId!: string;

  @Column()
  status!: string;
}
