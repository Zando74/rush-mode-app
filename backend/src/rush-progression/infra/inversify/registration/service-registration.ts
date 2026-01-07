import {Container} from 'inversify';
import {IntegrationEventBus} from '../../../../shared/app/event/integration-event-bus';
import {RushProgressionReadModel} from '../../../domain/read-model/port/rush-progression-read-model.port';
import {TYPES} from '../../../../shared/infra/inversify/type';
import {ReadDatabaseService} from '../../../../shared/infra/read-postgresql/init';
import {RushProgressionProjectionHandlerImpl} from '../../read-postgresql/handler/projection-handler.impl';
import {EventStore} from '../../../../shared/domain/port/event-store.port';
import {RushProgressionReadModelImpl} from '../../read-postgresql/repository/rush-progression-read-model.impl';

export const RegisterRushProgressionProjection = (container: Container) => {
  container
    .bind<RushProgressionReadModel>(TYPES.RushProgressionReadModel)
    .toConstantValue(
      new RushProgressionReadModelImpl(
        container.get<ReadDatabaseService>(TYPES.ReadDatabaseService),
      ),
    );
  container
    .bind<RushProgressionProjectionHandlerImpl>(
      TYPES.RushProgressionProjectionHandler,
    )
    .toConstantValue(
      new RushProgressionProjectionHandlerImpl(
        container.get<ReadDatabaseService>(TYPES.ReadDatabaseService),
        container.get<IntegrationEventBus>(TYPES.IntegrationEventBus),
        container.get<EventStore>(TYPES.EventStore),
      ),
    );
};
