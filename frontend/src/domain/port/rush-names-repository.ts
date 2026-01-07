export interface RushNamesRepository {
  findAllNames(): Promise<string[]>;
}
