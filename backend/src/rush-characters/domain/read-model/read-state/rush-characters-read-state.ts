import {CharacterEntityProps} from '../../entity/character.entity';

export type RushCharactersReadState = {
  id: string;
  name: string;
  characters: CharacterEntityProps[];
  open: boolean;
};
