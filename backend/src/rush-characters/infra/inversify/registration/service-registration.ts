import {Container} from 'inversify';
import {IntegrationEventBus} from '../../../../shared/app/event/integration-event-bus';
import {RushCharactersReadModel} from '../../../domain/read-model/port/rush-characters-read-model.port';
import {TYPES} from '../../../../shared/infra/inversify/type';
import {ReadDatabaseService} from '../../../../shared/infra/read-postgresql/init';
import {RushCharactersProjectionHandlerImpl} from '../../read-postgresql/handler/projection-handler.impl';
import {EventStore} from '../../../../shared/domain/port/event-store.port';
import {RushCharactersReadModelImpl} from '../../read-postgresql/repository/rush-characters-read-model.impl';

export const RegisterRushCharactersProjection = (container: Container) => {
  container
    .bind<RushCharactersReadModel>(TYPES.RushCharactersReadModel)
    .toConstantValue(
      new RushCharactersReadModelImpl(
        container.get<ReadDatabaseService>(TYPES.ReadDatabaseService),
      ),
    );
  container
    .bind<RushCharactersProjectionHandlerImpl>(
      TYPES.RushCharactersProjectionHandler,
    )
    .toConstantValue(
      new RushCharactersProjectionHandlerImpl(
        container.get<ReadDatabaseService>(TYPES.ReadDatabaseService),
        container.get<IntegrationEventBus>(TYPES.IntegrationEventBus),
        container.get<EventStore>(TYPES.EventStore),
      ),
    );
};
