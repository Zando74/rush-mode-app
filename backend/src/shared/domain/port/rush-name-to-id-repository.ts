import {RushNameToId} from '../entity/rush-name-to-id';

export interface RushNameToIdRepository {
  isRegistered(rushName: string): Promise<boolean>;
  registerRushNameToId(rushName: string, rushId: string): Promise<void>;
  getRushIdByName(rushName: string): Promise<RushNameToId | undefined>;
  getAllRushNames(): Promise<string[]>;
  delete(rushId: string): Promise<void>;
}
