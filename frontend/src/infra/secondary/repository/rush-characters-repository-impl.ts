import type { RushCharactersRepository } from "../../../domain/port/rush-characters-repository";
import type { RushCharacters } from "../../../domain/type/rush-characters";
import type { RushCharactersEvent } from "../../primary/audit/audit";
import { RouteEnum } from "../rest/route-enum";
import type WebService from "../rest/web-service";

export class RushCharactersRepositoryImpl implements RushCharactersRepository {
  private webService: WebService;

  constructor(webService: WebService) {
    this.webService = webService;
  }

  async findByName(rushName: string): Promise<RushCharacters> {
    const response = await this.webService.get(RouteEnum.GetRushCharacters, {
      rushName,
    });

    const responseData = await response.json();

    return responseData.data;
  }

  async findEventsByName(
    rushName: string,
    from: Date,
    to: Date
  ): Promise<RushCharactersEvent[]> {
    const response = await this.webService.get(
      RouteEnum.GetRushCharactersEvents,
      {
        rushName,
        from: from.toISOString(),
        to: to.toISOString(),
      }
    );
    const responseData = await response.json();

    return responseData.data;
  }
}
