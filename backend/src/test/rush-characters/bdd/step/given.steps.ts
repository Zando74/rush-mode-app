/* eslint-disable n/no-unpublished-import */
import {Given} from '@cucumber/cucumber';
import {GlobalWorld} from '../../../shared/support/global-world';
import {currentRushCharactersStatus} from '../../fixture/current-rush-characters-status.fixture';
import {ThrowingNonCriticalDomainEventHandler} from '../../../shared/utils/throwing-domain-event-handler';
import ContainerManager from '../../../../shared/infra/inversify/container-manager';
import {DomainEventBus} from '../../../../shared/domain/port/domain-event-bus';
import {TYPES} from '../../../../shared/infra/inversify/type';

Given(
  'a rush characters {string} tracking',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushCharacters.registerRushCharacters(rushName, rushName);
  },
);

Given(
  'a default rooster for rush {string}',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushCharacters.processRushCharactersUpdateStatus(
      rushName,
      currentRushCharactersStatus.characters,
    );
  },
);

Given(
  'a snapshot strategy of every {string} events',
  (snapshotFrequency: string) => {
    process.env.SNAPSHOT_FREQUENCY = snapshotFrequency;
  },
);

Given('a throwing non critical domain event handler', () => {
  new ThrowingNonCriticalDomainEventHandler(
    ContainerManager.get<DomainEventBus>(TYPES.DomainEventBus),
  );
});
