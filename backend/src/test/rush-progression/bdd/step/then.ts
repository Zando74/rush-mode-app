/* eslint-disable n/no-unpublished-import */
import {Then} from '@cucumber/cucumber';
import * as assert from 'assert';
import {GlobalWorld} from '../../../shared/support/global-world';
import {RushProgressionId} from '../../../../shared/domain/value-object/rush-id';
import {RushProgressionSnapshotState} from '../../../../rush-progression/domain/entity/rush-progression.aggregate';

Then(
  'the rush {string} progression should be saved in the database',
  async function (this: GlobalWorld, rushName: string) {
    const rushProgression =
      await this.rushProgression.getRushProgression(rushName);
    assert.ok(rushProgression, 'Rush Progression projection should exist');
    assert.strictEqual(rushProgression?.data.name, rushProgression.data.name);
  },
);

Then(
  'the rush {string} progression should be closed',
  async function (this: GlobalWorld, rushName: string) {
    const rushProgression =
      await this.rushProgression.getRushProgression(rushName);
    assert.ok(rushProgression, 'Rush fraud projection should exist');
    assert.strictEqual(rushProgression.data.open, false);
  },
);

Then(
  'the rush {string} progression should be cleaned up',
  async function (this: GlobalWorld, rushName: string) {
    const rushProgression =
      await this.rushProgression.eventStore.loadFromLatestSnapshot<RushProgressionSnapshotState>(
        new RushProgressionId(rushName),
      );
    assert.strictEqual(
      rushProgression.events.length,
      0,
      'Rush progression should be cleaned up',
    );
    assert.strictEqual(
      rushProgression.snapshot,
      undefined,
      'Rush progression should be cleaned up',
    );
  },
);
