/* eslint-disable n/no-unpublished-import */
import {Given} from '@cucumber/cucumber';
import {GlobalWorld} from '../../../shared/support/global-world';

Given(
  'a rush progression {string} tracking',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushProgression.registerRushProgression(rushName, rushName);
  },
);

Given(
  'a default progression set for rush {string}',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushProgression.registerRushProgressionEvents(rushName, [
      {
        playerName: 'Legolas',
        achievements: ['achievement1', 'achievement2'],
      },
    ]);
  },
);
