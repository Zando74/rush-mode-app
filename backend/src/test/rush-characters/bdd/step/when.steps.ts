/* eslint-disable n/no-unpublished-import */
import {When} from '@cucumber/cucumber';
import {GlobalWorld} from '../../../shared/support/global-world';
import {updatedRushCharactersStatus} from '../../fixture/rush-characters-status-updated.fixture';
import {RushCharactersId} from '../../../../shared/domain/value-object/rush-id';
import {
  RushCharactersAggregate,
  RushCharactersSnapshotState,
  RushCharactersAggregateType,
} from '../../../../rush-characters/domain/entity/rush-characters.aggregate';
import {BaseEsRootAggregate} from '../../../../shared/domain/entity/base-es-root-aggregate';
import {CharacterEntity} from '../../../../rush-characters/domain/entity/character.entity';

When(
  'I synchronize the rush {string} characters status',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushCharacters.processRushCharactersUpdateStatus(
      rushName,
      updatedRushCharactersStatus.characters,
    );
  },
);

When(
  'I close the rush {string} characters',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushCharacters.closeRushCharacters(rushName);
  },
);

When(
  'character {string} died in rush {string}',
  async function (this: GlobalWorld, characterName: string, rushName: string) {
    await this.rushCharacters.processRushCharactersUpdateStatus(
      rushName,
      updatedRushCharactersStatus.characters.map(c => {
        if (c.characterName === characterName) {
          c.isDead = true;
          c.lastUpdate += 1000;
        }
        return c;
      }),
    );
  },
);

When(
  'two synchronization processes in rush {string} are started simultaneously',
  async function (this: GlobalWorld, rushName: string) {
    const events =
      await this.rushCharacters.eventStore.loadFromLatestSnapshot<RushCharactersSnapshotState>(
        new RushCharactersId(rushName),
      );

    const agg1 = BaseEsRootAggregate.rehydrate(
      RushCharactersAggregate,
      events.events,
      events.snapshot,
    );
    const agg2 = BaseEsRootAggregate.rehydrate(
      RushCharactersAggregate,
      events.events,
      events.snapshot,
    );

    const eventsFromAgg1 = agg1.submitRushCharactersStatus(
      updatedRushCharactersStatus.characters.map(c => new CharacterEntity(c)),
    );
    const eventsFromAgg2 = agg2.submitRushCharactersStatus(
      updatedRushCharactersStatus.characters.map(c => new CharacterEntity(c)),
    );
    await this.rushCharacters.eventStore.save(
      new RushCharactersId(rushName),
      eventsFromAgg1,
      agg1.toSnapshot(),
      RushCharactersAggregateType,
    );
    try {
      await this.rushCharacters.eventStore.save(
        new RushCharactersId(rushName),
        eventsFromAgg2,
        agg2.toSnapshot(),
        RushCharactersAggregateType,
      );
    } catch (e) {
      this.error = e;
    }
  },
);

When(
  'I try to register the rush {string} characters again',
  async function (this: GlobalWorld, rushName: string) {
    try {
      await this.rushCharacters.registerRushCharacters(rushName, rushName);
    } catch (e) {
      this.error = e;
    }
  },
);

When(
  'I try to synchronize a rush that does not exist',
  async function (this: GlobalWorld) {
    try {
      await this.rushCharacters.processRushCharactersUpdateStatus(
        'UNKNOWN-KEY',
        updatedRushCharactersStatus.characters,
      );
    } catch (e) {
      this.error = e;
    }
  },
);

When('I clear domain events cache', async function (this: GlobalWorld) {
  this.domainEvents = [];
});

When(
  'I clean up the rush {string} characters',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushCharacters.cleanUpRushCharacters(rushName);
  },
);
