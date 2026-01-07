import type {
  RushCharacters,
  RushCharactersEvent,
} from "../type/rush-characters";

export interface RushCharactersRepository {
  findByName(rushName: string): Promise<RushCharacters>;
  findEventsByName(
    rushName: string,
    from: Date,
    to: Date
  ): Promise<RushCharactersEvent[]>;
}
