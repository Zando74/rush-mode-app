import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('rush_name_to_id')
export class RushNameToIdModel {
  @PrimaryColumn()
  rushName: string;
  @Column()
  rushId: string;
}
