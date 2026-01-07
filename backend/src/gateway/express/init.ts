import express from 'express';
import cors from 'cors';
import {errorHandler} from './middleware/error-handler';
import setRushCharactersRouter from './rush-character-controller';
import {Logger} from '../../shared/infra/logger/logger';
import setRushFraudRouter from './rush-fraud-controller';
import setRushProgressionRouter from './rush-progression-controller';

const initController = () => {
  const app = express();

  app.use(express.json({limit: '250MB'}));

  const corsOption = {
    origin: '*',
    methods: 'GET,POST',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOption));

  setRushCharactersRouter(app);
  setRushFraudRouter(app);
  setRushProgressionRouter(app);
  app.use(errorHandler);

  app.all(/(.*)/, (_, res) => {
    res.status(404).send('Not Found');
  });

  app.listen(process.env.RUSH_MODE_SERVICE_PORT, () => {
    Logger.info('Express server started');
  });
};

export default initController;
