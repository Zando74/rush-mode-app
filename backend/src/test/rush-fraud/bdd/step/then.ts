/* eslint-disable n/no-unpublished-import */
import {Then} from '@cucumber/cucumber';
import * as assert from 'assert';
import {GlobalWorld} from '../../../shared/support/global-world';
import {RushFraudSnapshotState} from '../../../../rush-fraud/domain/entity/rush-fraud.aggregate';
import {RushFraudId} from '../../../../shared/domain/value-object/rush-id';

Then(
  'the rush {string} fraud should be saved in the database',
  async function (this: GlobalWorld, rushName: string) {
    const rushFraud = await this.rushFraud.getRushFraud(rushName);
    assert.ok(rushFraud, 'Rush fraud projection should exist');
    assert.strictEqual(rushFraud?.data.name, rushFraud.data.name);
  },
);

Then(
  'the rush {string} fraud should be closed',
  async function (this: GlobalWorld, rushName: string) {
    const rushFraud = await this.rushFraud.getRushFraud(rushName);
    assert.ok(rushFraud, 'Rush fraud projection should exist');
    assert.strictEqual(rushFraud.data.open, false);
  },
);

Then(
  'the rush {string} fraud should be cleaned up',
  async function (this: GlobalWorld, rushName: string) {
    const rushFraud =
      await this.rushFraud.eventStore.loadFromLatestSnapshot<RushFraudSnapshotState>(
        new RushFraudId(rushName),
      );
    assert.strictEqual(
      rushFraud.events.length,
      0,
      'Rush fraud should be cleaned up',
    );
    assert.strictEqual(
      rushFraud.snapshot,
      undefined,
      'Rush fraud should be cleaned up',
    );
  },
);
