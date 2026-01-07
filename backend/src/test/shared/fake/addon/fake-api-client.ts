import {RouteEnum} from '../../../../gateway/express/route-enum';
import {CharacterEntityProps} from '../../../../rush-characters/domain/entity/character.entity';
import {MailEntityProps} from '../../../../rush-fraud/domain/entity/mail.entity';
import {TradeEntityProps} from '../../../../rush-fraud/domain/entity/trade.entity';
import {ProgressionEntityProps} from '../../../../rush-progression/domain/entity/progression.entity';

export class FakeApiClient {
  async sendPlayerStatusUpdate(
    rushId: string,
    characters: CharacterEntityProps[],
  ) {
    await fetch(
      `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.PlayersStatusUpdate}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLIENT_API_KEY,
        },
        body: JSON.stringify({
          rushId: rushId,
          characters: characters,
        }),
      },
    );
  }

  async sendFraudMailRegister(rushId: string, mails: MailEntityProps[]) {
    await fetch(
      `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.registerRushFraudEmail}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLIENT_API_KEY,
        },
        body: JSON.stringify({
          rushId: rushId,
          mails: mails,
        }),
      },
    );
  }

  async sendFraudTradeRegister(rushId: string, trades: TradeEntityProps[]) {
    await fetch(
      `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.registerRushFraudTrade}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLIENT_API_KEY,
        },
        body: JSON.stringify({
          rushId: rushId,
          trades: trades,
        }),
      },
    );
  }

  async sendProgressionRegister(
    rushId: string,
    progressions: ProgressionEntityProps[],
  ) {
    await fetch(
      `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.registerRushProgressionEvents}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLIENT_API_KEY,
        },
        body: JSON.stringify({
          rushId: rushId,
          progressions: progressions,
        }),
      },
    );
  }

  async sendCloseRush(rushId: string) {
    try {
      await fetch(
        `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.CloseRushCharacters}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ADMIN_API_KEY,
          },
          body: JSON.stringify({
            rushId: rushId,
          }),
        },
      );
    } catch (e) {}
    try {
      await fetch(
        `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.CloseRushFraud}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ADMIN_API_KEY,
          },
          body: JSON.stringify({
            rushId: rushId,
          }),
        },
      );
    } catch (e) {}
    try {
      await fetch(
        `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.CloseRushProgression}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ADMIN_API_KEY,
          },
          body: JSON.stringify({
            rushId: rushId,
          }),
        },
      );
    } catch (e) {}
  }

  async sendRushRegister(rushId: string, name: string) {
    try {
      let res = await fetch(
        `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.RegisterRushCharacters}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ADMIN_API_KEY,
          },
          body: JSON.stringify({
            rushId: rushId,
            name: name,
          }),
        },
      );
      if (res.status !== 200) {
        throw new Error('Error registering rush');
      }
      res = await fetch(
        `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.RegisterRushFraud}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ADMIN_API_KEY,
          },
          body: JSON.stringify({
            rushId: rushId,
            name: name,
          }),
        },
      );
      if (res.status !== 200) {
        throw new Error('Error registering rush');
      }
      res = await fetch(
        `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.RegisterRushProgression}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ADMIN_API_KEY,
          },
          body: JSON.stringify({
            rushId: rushId,
            name: name,
          }),
        },
      );
      if (res.status !== 200) {
        throw new Error('Error registering rush');
      }
    } catch (e) {
      await this.sendCloseRush(rushId);
      await this.sendRushCleanUp(rushId);
      await this.sendRushRegister(rushId, name);
    }
  }

  async sendRushCleanUp(rushId: string) {
    try {
      await fetch(
        `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.CleanUpRushCharacters}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ADMIN_API_KEY,
          },
          body: JSON.stringify({
            rushId: rushId,
          }),
        },
      );
    } catch (e) {}
    try {
      await fetch(
        `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.CleanUpRushFraud}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ADMIN_API_KEY,
          },
          body: JSON.stringify({
            rushId: rushId,
          }),
        },
      );
    } catch (e) {}
    try {
      await fetch(
        `http://localhost:${process.env.RUSH_MODE_SERVICE_PORT}${RouteEnum.CleanUpRushProgression}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ADMIN_API_KEY,
          },
          body: JSON.stringify({
            rushId: rushId,
          }),
        },
      );
    } catch (e) {}
  }
}
