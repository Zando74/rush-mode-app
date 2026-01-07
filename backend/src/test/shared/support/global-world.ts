/* eslint-disable n/no-unpublished-import */
import {setWorldConstructor} from '@cucumber/cucumber';
import {RushCharactersWorld} from '../../rush-characters/support/rush-characters-world';
import ContainerManager from '../../../shared/infra/inversify/container-manager';
import {TYPES} from '../../../shared/infra/inversify/type';
import {IntegrationEvent} from '../../../shared/app/event/integration-event';
import {DomainEvent} from '../../../shared/domain/event/domain-event';
import dotenv from 'dotenv';
import {DomainEventBus} from '../../../shared/domain/port/domain-event-bus';
import {StartRushCharactersApplication} from '../../../rush-characters/application';
import {RushFraudWorld} from '../../rush-fraud/support/rush-fraud-world';
import {StartRushFraudApplication} from '../../../rush-fraud/application';
import {RushProgressionWorld} from '../../rush-progression/support/rush-progression-world';
import {StartRushProgressionApplication} from '../../../rush-progression/application';
dotenv.config();

export class GlobalWorld {
  rushCharacters: RushCharactersWorld;
  rushFraud: RushFraudWorld;
  rushProgression: RushProgressionWorld;
  error: unknown;

  domainEvents: DomainEvent[] = [];
  integrationEvents: IntegrationEvent[] = [];

  constructor() {
    this.rushCharacters = new RushCharactersWorld();
    this.rushFraud = new RushFraudWorld();
    this.rushProgression = new RushProgressionWorld();
  }

  private async subscribeToEvents() {
    ContainerManager.get<DomainEventBus>(
      TYPES.DomainEventBus,
    ).subscribeCritical('*', {
      handle: async event => {
        this.domainEvents.push(event);
      },
    });
  }

  async enableInfraRepositories() {
    await ContainerManager.initializeSharedResources();
    await StartRushCharactersApplication();
    this.rushCharacters.reloadInfraRepositories();
    await StartRushFraudApplication();
    this.rushFraud.reloadInfraRepositories();
    await StartRushProgressionApplication();
    this.rushProgression.reloadInfraRepositories();
    await this.subscribeToEvents();
  }
}

setWorldConstructor(GlobalWorld);
