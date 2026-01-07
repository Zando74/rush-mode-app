import {Entity, PrimaryGeneratedColumn, Column, Index} from 'typeorm';
import {AggregateIdValue} from '../../../domain/value-object/aggregate-id';
import {EventPayload} from '../../../domain/event/domain-event';
import {BoundedContext} from '../../../domain/value-object/bounded-context';

@Entity('event_store')
@Index(['identityHash', 'sequenceNumber'], {unique: true})
export class EventStoreModel {
  @PrimaryGeneratedColumn({primaryKeyConstraintName: 'PK_EVENT_STORE_EVENT_ID'})
  id?: number;

  @Column('jsonb')
  aggregateId!: {value: AggregateIdValue};

  @Column()
  identityHash!: string;

  @Column()
  type!: string;

  @Column()
  boundedContext!: BoundedContext;

  @Column('bigint')
  sequenceNumber!: number;

  @Column('jsonb')
  payload!: EventPayload;

  @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  occuredAt!: Date;
}
