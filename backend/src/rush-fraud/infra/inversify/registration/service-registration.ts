import {Container} from 'inversify';
import {IntegrationEventBus} from '../../../../shared/app/event/integration-event-bus';
import {RushFraudReadModel} from '../../../domain/read-model/port/rush-fraud-read-model.port';
import {TYPES} from '../../../../shared/infra/inversify/type';
import {ReadDatabaseService} from '../../../../shared/infra/read-postgresql/init';
import {RushFraudProjectionHandlerImpl} from '../../read-postgresql/handler/projection-handler.impl';
import {EventStore} from '../../../../shared/domain/port/event-store.port';
import {RushFraudReadModelImpl} from '../../read-postgresql/repository/rush-fraud-read-model.impl';

export const RegisterRushFraudProjection = (container: Container) => {
  container
    .bind<RushFraudReadModel>(TYPES.RushFraudReadModel)
    .toConstantValue(
      new RushFraudReadModelImpl(
        container.get<ReadDatabaseService>(TYPES.ReadDatabaseService),
      ),
    );
  container
    .bind<RushFraudProjectionHandlerImpl>(TYPES.RushFraudProjectionHandler)
    .toConstantValue(
      new RushFraudProjectionHandlerImpl(
        container.get<ReadDatabaseService>(TYPES.ReadDatabaseService),
        container.get<IntegrationEventBus>(TYPES.IntegrationEventBus),
        container.get<EventStore>(TYPES.EventStore),
      ),
    );
};
