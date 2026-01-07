import express, {Request, Response} from 'express';
import {requireAdminKey} from './middleware/require-admin-key';
import {requireClientKey} from './middleware/require-client-key';
import {createCallerFactory} from '../../shared/infra/trpc/trpc';
import {RushProgressionAppRouter} from '../../rush-progression/infra/trpc/app';
import {RouteEnum} from './route-enum';
import {requireFrontendKey} from './middleware/require-frontend-key';

const router = express.Router();

const setRushProgressionRouter = (app: express.Application) => {
  router.post(
    RouteEnum.RegisterRushProgression,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId, name} = req.body;

      const createCaller = createCallerFactory(RushProgressionAppRouter);
      const caller = createCaller({});
      await caller.registerRushProgression({rushId, name});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.CloseRushProgression,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId} = req.body;

      const createCaller = createCallerFactory(RushProgressionAppRouter);
      const caller = createCaller({});
      await caller.closeRush({rushId});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.OpenRushProgression,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId} = req.body;

      const createCaller = createCallerFactory(RushProgressionAppRouter);
      const caller = createCaller({});
      await caller.openRush({rushId});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.CleanUpRushProgression,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId} = req.body;

      const createCaller = createCallerFactory(RushProgressionAppRouter);
      const caller = createCaller({});
      await caller.cleanUpRush({rushId});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.registerRushProgressionEvents,
    requireClientKey,
    async (req: Request, res: Response) => {
      const {rushId, progressions} = req.body;

      const createCaller = createCallerFactory(RushProgressionAppRouter);
      const caller = createCaller({});
      await caller.registerRushProgressionEvents({rushId, progressions});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.get(
    RouteEnum.GetRushProgression,
    requireFrontendKey,
    async (req: Request, res: Response) => {
      const {rushName} = req.query as {rushName: string};

      const createCaller = createCallerFactory(RushProgressionAppRouter);
      const caller = createCaller({});
      const rushProgression = await caller.getRushProgression({rushName});
      res.status(200).send(rushProgression);
    },
  );

  app.use(router);
};

export default setRushProgressionRouter;
