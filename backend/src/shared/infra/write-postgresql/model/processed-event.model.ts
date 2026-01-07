import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('processed_events')
export class ProcessedEventModel {
  @PrimaryColumn({primaryKeyConstraintName: 'PK_PROCESSED_EVENT_ID'})
  id!: string;

  @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  createdAt!: Date;
}
