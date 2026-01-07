import {Entity, Column, PrimaryColumn} from 'typeorm';
import {CharacterEntityProps} from '../../../domain/entity/character.entity';

@Entity('rush_characters')
export class RushCharactersProjection {
  @PrimaryColumn({primaryKeyConstraintName: 'PK_RUSH_CHARACTERS_ID'})
  id!: string;

  @Column()
  name!: string;

  @Column('jsonb')
  characters!: CharacterEntityProps[];

  @Column()
  open!: boolean;
}
