/* eslint-disable n/no-unpublished-import */
import {Then} from '@cucumber/cucumber';
import * as assert from 'assert';
import {ConcurrencyError} from '../../../../shared/infra/error/concurency-error';
import {GlobalWorld} from '../../../shared/support/global-world';
import {RushCharactersSnapshotState} from '../../../../rush-characters/domain/entity/rush-characters.aggregate';
import {RushCharactersId} from '../../../../shared/domain/value-object/rush-id';
import {updatedRushCharactersStatus} from '../../fixture/rush-characters-status-updated.fixture';

Then('exactly one should succeed', async function (this: GlobalWorld) {
  assert.ok(this.error, 'Error should be defined');
  assert.ok(
    this.error instanceof ConcurrencyError,
    'Error should be a ConcurencyError',
  );
});

Then('an error should be thrown', async function (this: GlobalWorld) {
  assert.ok(this.error, 'Error should be defined');
});

Then(
  'a snapshot should be created for rush {string}',
  async function (this: GlobalWorld, rushName: string) {
    const guildEvents =
      await this.rushCharacters.eventStore.loadFromLatestSnapshot<RushCharactersSnapshotState>(
        new RushCharactersId(rushName),
      );
    assert.ok(guildEvents.snapshot, 'Snapshot should exist');
    assert.ok(
      guildEvents.events[0]?.sequenceNumber > guildEvents.snapshot.version,
    );
  },
);

Then('no error should be thrown', async function (this: GlobalWorld) {
  assert.ok(this.error === undefined);
});

Then(
  'the rush {string} characters projection should be saved in the database',
  async function (this: GlobalWorld, rushName: string) {
    const rushCharacters =
      await this.rushCharacters.getRushCharacters(rushName);
    assert.ok(rushCharacters, 'Rush characters projection should exist');
    assert.strictEqual(rushCharacters?.data.name, rushCharacters.data.name);
  },
);

Then(
  'all player of rush {string} should match the synchronized data',
  async function (this: GlobalWorld, rushName: string) {
    const rushCharacters =
      await this.rushCharacters.getRushCharacters(rushName);

    for (const player of rushCharacters.data.characters) {
      const existingPlayer = updatedRushCharactersStatus.characters.find(
        c => c.characterId === player.characterId,
      );
      assert.ok(existingPlayer, 'Player should be defined');
      assert.strictEqual(existingPlayer?.characterName, player.characterName);
      assert.strictEqual(existingPlayer?.playerName, player.playerName);
      assert.strictEqual(existingPlayer?.isDead, player.isDead);
      assert.strictEqual(existingPlayer?.classId, player.classId);
      assert.strictEqual(existingPlayer?.moneyInCopper, player.moneyInCopper);
      assert.strictEqual(existingPlayer?.level, player.level);
      for (const profession of existingPlayer?.professions ?? []) {
        const existingProfession = player.professions.find(
          p => p.professionId === profession.professionId,
        );
        assert.ok(existingProfession, 'Profession should be defined');
        assert.strictEqual(existingProfession?.level, profession.level);
      }
      assert.strictEqual(existingPlayer?.lastUpdate, player.lastUpdate);
      for (const item of existingPlayer?.itemIds ?? []) {
        const existingItem = player.itemIds.find(i => i === item);
        assert.ok(existingItem, 'Item should be defined');
      }
      assert.strictEqual(existingPlayer?.team, player.team);
    }
  },
);

Then(
  'the rush {string} characters should be closed',
  async function (this: GlobalWorld, rushName: string) {
    const rushCharacters =
      await this.rushCharacters.getRushCharacters(rushName);
    assert.ok(rushCharacters, 'Rush characters projection should exist');
    assert.strictEqual(rushCharacters.data.open, false);
  },
);

Then('No new events should be emitted', async function (this: GlobalWorld) {
  assert.ok(this.domainEvents.length === 0);
});

Then(
  'the rush {string} characters should be cleaned up',
  async function (this: GlobalWorld, rushName: string) {
    const rushCharacters =
      await this.rushCharacters.eventStore.loadFromLatestSnapshot<RushCharactersSnapshotState>(
        new RushCharactersId(rushName),
      );
    assert.strictEqual(
      rushCharacters.events.length,
      0,
      'Rush characters should be cleaned up',
    );
    assert.strictEqual(
      rushCharacters.snapshot,
      undefined,
      'Rush characters should be cleaned up',
    );
  },
);

Then(
  'the rush {string} events should be stored in the audit log',
  async function (this: GlobalWorld, rushName: string) {
    const rushCharacters = await this.rushCharacters.getRushCharactersEvents(
      rushName,
      new Date('1970-01-01T00:00:00.000Z'),
      new Date(),
    );
    assert.ok(
      rushCharacters.data.length > 0,
      'Rush characters events should exist',
    );
    let eventCount = 0;
    for (const event of rushCharacters.data) {
      eventCount += event.events.length;
    }
    // TODO: may split aggregate why should we have events of the rushCharacters
    assert.strictEqual(eventCount, this.domainEvents.length - 1); // rush registration event
  },
);
