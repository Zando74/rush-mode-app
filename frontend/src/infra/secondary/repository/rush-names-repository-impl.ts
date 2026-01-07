import type { RushNamesRepository } from "../../../domain/port/rush-names-repository";
import { RouteEnum } from "../rest/route-enum";
import type WebService from "../rest/web-service";

export class RushNamesRepositoryImpl implements RushNamesRepository {
  private webService: WebService;

  constructor(webService: WebService) {
    this.webService = webService;
  }

  async findAllNames(): Promise<string[]> {
    const response = await this.webService.get(RouteEnum.GetRushNames);

    return response.json();
  }
}
