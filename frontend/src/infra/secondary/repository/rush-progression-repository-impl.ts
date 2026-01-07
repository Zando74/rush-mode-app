import type { RushProgressionRepository } from "../../../domain/port/rush-progression-repository";
import type { RushProgression } from "../../../domain/type/rush-progression";
import { RouteEnum } from "../rest/route-enum";
import type WebService from "../rest/web-service";

export class RushProgressionRepositoryImpl
  implements RushProgressionRepository
{
  private webService: WebService;

  constructor(webService: WebService) {
    this.webService = webService;
  }

  async findByName(rushName: string): Promise<RushProgression> {
    const response = await this.webService.get(RouteEnum.GetRushProgression, {
      rushName,
    });

    const responseData = await response.json();

    return responseData.data;
  }
}
