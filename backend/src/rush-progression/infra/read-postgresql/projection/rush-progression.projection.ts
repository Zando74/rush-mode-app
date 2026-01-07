import {Entity, Column, PrimaryColumn} from 'typeorm';
import {ProgressionEntityProps} from '../../../domain/entity/progression.entity';

@Entity('rush_progression')
export class RushProgressionProjection {
  @PrimaryColumn({primaryKeyConstraintName: 'PK_RUSH_PROGRESSION_ID'})
  id!: string;

  @Column()
  name!: string;

  @Column('jsonb')
  progressions!: ProgressionEntityProps[];

  @Column()
  open!: boolean;
}
