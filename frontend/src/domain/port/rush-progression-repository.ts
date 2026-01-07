import type { RushProgression } from "../type/rush-progression";

export interface RushProgressionRepository {
  findByName(rushName: string): Promise<RushProgression>;
}
