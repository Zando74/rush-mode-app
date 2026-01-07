import {Column, Entity, Index, PrimaryColumn} from 'typeorm';
import {AggregateIdValue} from '../../../domain/value-object/aggregate-id';

@Entity('snapshot')
@Index(['identityHash'], {unique: true})
export class SnapshotModel {
  @PrimaryColumn({
    primaryKeyConstraintName: 'PK_SNAPSHOT_IDENTITY_HASH',
  })
  identityHash!: string;

  @Column('jsonb')
  aggregateId!: {value: AggregateIdValue};

  @Column('jsonb')
  data!: object;

  @Column()
  lastSequenceNumber!: number;

  @Column()
  createdAt!: Date;
}
