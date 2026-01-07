import {Repository} from 'typeorm';
import {RushNameToIdModel} from '../model/rush-name-to-id.model';
import {Logger} from '../../logger/logger';
import {WriteDatabaseService} from '../init';
import {Traceable} from '../../logger/trace/decorator/trace-event-store-decorator';
import {RushNameToIdRepository} from '../../../domain/port/rush-name-to-id-repository';
import {RushNameToId} from '../../../domain/entity/rush-name-to-id';

export class PgRushNameToIdRepository implements RushNameToIdRepository {
  private repo: Repository<RushNameToIdModel>;

  constructor(db: WriteDatabaseService) {
    this.repo = db.getRepository(RushNameToIdModel);
    Logger.info('RushNameToId repository initialized');
  }

  @Traceable()
  async registerRushNameToId(rushName: string, rushId: string) {
    await this.repo.save({rushName, rushId});
  }

  @Traceable()
  async getRushIdByName(rushName: string): Promise<RushNameToId | undefined> {
    const rushNameToId = await this.repo.findOne({
      where: {rushName: rushName},
    });

    if (!rushNameToId) {
      return undefined;
    }

    return new RushNameToId(rushName, rushNameToId.rushId);
  }

  @Traceable()
  async delete(rushId: string): Promise<void> {
    await this.repo.delete({rushId});
  }

  @Traceable()
  async getAllRushNames(): Promise<string[]> {
    const rushNames = await this.repo.find();
    return rushNames.map(rushName => rushName.rushName);
  }

  @Traceable()
  async isRegistered(rushName: string): Promise<boolean> {
    const rushId = await this.repo.findOne({
      where: {rushName: rushName},
    });
    return !!rushId;
  }
}
