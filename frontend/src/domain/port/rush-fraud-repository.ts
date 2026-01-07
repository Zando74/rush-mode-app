import type { RushFraud } from "../type/rush-fraud";

export interface RushFraudRepository {
  findByName(rushName: string): Promise<RushFraud>;
}
