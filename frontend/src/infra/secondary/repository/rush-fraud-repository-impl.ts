import type { RushFraudRepository } from "../../../domain/port/rush-fraud-repository";
import type { RushFraud } from "../../../domain/type/rush-fraud";
import { RouteEnum } from "../rest/route-enum";
import type WebService from "../rest/web-service";

export class RushFraudRepositoryImpl implements RushFraudRepository {
  private webService: WebService;

  constructor(webService: WebService) {
    this.webService = webService;
  }

  async findByName(rushName: string): Promise<RushFraud> {
    const response = await this.webService.get(RouteEnum.GetRushFraud, {
      rushName,
    });

    const responseData = await response.json();

    return responseData.data;
  }
}
