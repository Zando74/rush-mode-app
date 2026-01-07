/* eslint-disable n/no-unpublished-import */
import {When} from '@cucumber/cucumber';
import {GlobalWorld} from '../../../shared/support/global-world';

When(
  'I synchronize the rush {string} progression',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushProgression.registerRushProgressionEvents(rushName, [
      {
        playerName: 'Legolas',
        achievements: ['achievement1', 'achievement2', 'achievement3'],
      },
    ]);
  },
);

When(
  'I close the rush {string} progression',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushProgression.closeRushProgression(rushName);
  },
);

When(
  'I clean up the rush {string} progression',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushProgression.cleanUpRushProgression(rushName);
  },
);

When(
  'I try to register the rush {string} progression again',
  async function (this: GlobalWorld, rushName: string) {
    try {
      await this.rushProgression.registerRushProgression(rushName, rushName);
    } catch (e) {
      this.error = e;
    }
  },
);

When(
  'I try to synchronize a rush progression that does not exist',
  async function (this: GlobalWorld) {
    try {
      await this.rushProgression.registerRushProgressionEvents('UNKNOWN-KEY', [
        {
          playerName: 'Legolas',
          achievements: ['achievement1', 'achievement2', 'achievement3'],
        },
      ]);
    } catch (e) {
      this.error = e;
    }
  },
);
