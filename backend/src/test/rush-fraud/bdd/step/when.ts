/* eslint-disable n/no-unpublished-import */
import {When} from '@cucumber/cucumber';
import {GlobalWorld} from '../../../shared/support/global-world';

When(
  'I synchronize the rush {string} fraud',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushFraud.registerFraudMail(rushName, [
      {
        playerName: 'Legolas',
        sender: 'richManAgain',
        goldTaken: 100,
        attachments: [
          {
            id: 1,
            quantity: 1,
          },
        ],
        timestamp: 1633073000,
      },
    ]);
    await this.rushFraud.registerFraudTrade(rushName, [
      {
        playerName: 'Legolas',
        giver: 'richManAgain',
        goldReceived: 100,
        items: [
          {
            id: 1,
            quantity: 1,
          },
        ],
        timestamp: 1633073000,
      },
    ]);
  },
);

When(
  'I close the rush {string} fraud',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushFraud.closeRushFraud(rushName);
  },
);

When(
  'I clean up the rush {string} fraud',
  async function (this: GlobalWorld, rushName: string) {
    await this.rushFraud.cleanUpRushFraud(rushName);
  },
);

When(
  'I try to register the rush {string} fraud again',
  async function (this: GlobalWorld, rushName: string) {
    try {
      await this.rushFraud.registerRushFraud(rushName, rushName);
    } catch (e) {
      this.error = e;
    }
  },
);

When(
  'I try to synchronize a rush fraud that does not exist',
  async function (this: GlobalWorld) {
    try {
      await this.rushFraud.registerFraudMail('UNKNOWN-KEY', [
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
    } catch (e) {
      this.error = e;
    }
  },
);
