/* eslint-disable n/no-unpublished-import */
import {Given} from '@cucumber/cucumber';
import {GlobalWorld} from '../../../shared/support/global-world';

Given(
  'a rush fraud {string} tracking',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushFraud.registerRushFraud(rushName, rushName);
  },
);

Given(
  'a default fraud set for rush {string}',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushFraud.registerFraudMail(rushName, [
      {
        playerName: 'Legolas',
        sender: 'richMan',
        goldTaken: 100,
        attachments: [
          {
            id: 1,
            quantity: 1,
          },
        ],
        timestamp: 1633072800,
      },
    ]);
    await this.rushFraud.registerFraudTrade(rushName, [
      {
        playerName: 'Legolas',
        giver: 'richMan',
        goldReceived: 100,
        items: [
          {
            id: 1,
            quantity: 1,
          },
        ],
        timestamp: 1633072800,
      },
    ]);
  },
);
