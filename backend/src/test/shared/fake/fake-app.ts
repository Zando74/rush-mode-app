import {Logger} from '../../../shared/infra/logger/logger';
import {
  RESET_TIMEOUT_MS,
  SEND_PLAYER_STATUS_UPDATE_INTERVAL_MS,
} from './addon/config';
import {FakeAddon} from './addon/fake-addon';
import {FakeApiClient} from './addon/fake-api-client';

const fakeDemoApp = async () => {
  let fakeAddon = new FakeAddon();
  const fakeApiClient = new FakeApiClient();
  fakeAddon.start();
  await fakeApiClient.sendRushRegister(fakeAddon.rushId, fakeAddon.name);

  setInterval(async () => {
    try {
      await fakeApiClient.sendPlayerStatusUpdate(
        fakeAddon.rushId,
        fakeAddon.players.map(p => p.currentCharacters).flat(),
      );
      await fakeApiClient.sendFraudMailRegister(
        fakeAddon.rushId,
        fakeAddon.frauds.mails,
      );
      await fakeApiClient.sendFraudTradeRegister(
        fakeAddon.rushId,
        fakeAddon.frauds.trades,
      );
      await fakeApiClient.sendProgressionRegister(
        fakeAddon.rushId,
        fakeAddon.progressions,
      );
    } catch (e) {}
  }, SEND_PLAYER_STATUS_UPDATE_INTERVAL_MS);

  setInterval(async () => {
    fakeAddon.stop();
    await fakeApiClient.sendCloseRush(fakeAddon.rushId);
    await fakeApiClient.sendRushCleanUp(fakeAddon.rushId);
    await fakeApiClient.sendRushRegister(fakeAddon.rushId, fakeAddon.name);
    fakeAddon = new FakeAddon();
    fakeAddon.start();
  }, RESET_TIMEOUT_MS);
};

export {fakeDemoApp};
