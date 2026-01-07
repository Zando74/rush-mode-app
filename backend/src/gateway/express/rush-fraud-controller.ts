import express, {Request, Response} from 'express';
import {requireAdminKey} from './middleware/require-admin-key';
import {requireClientKey} from './middleware/require-client-key';
import {createCallerFactory} from '../../shared/infra/trpc/trpc';
import {RushFraudAppRouter} from '../../rush-fraud/infra/trpc/app';
import {RouteEnum} from './route-enum';
import {requireFrontendKey} from './middleware/require-frontend-key';

const router = express.Router();

const setRushFraudRouter = (app: express.Application) => {
  router.post(
    RouteEnum.RegisterRushFraud,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId, name} = req.body;

      const createCaller = createCallerFactory(RushFraudAppRouter);
      const caller = createCaller({});
      await caller.registerRushFraud({rushId, name});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.CloseRushFraud,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId} = req.body;

      const createCaller = createCallerFactory(RushFraudAppRouter);
      const caller = createCaller({});
      await caller.closeRush({rushId});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.OpenRushFraud,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId} = req.body;

      const createCaller = createCallerFactory(RushFraudAppRouter);
      const caller = createCaller({});
      await caller.openRush({rushId});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.registerRushFraudEmail,
    requireClientKey,
    async (req: Request, res: Response) => {
      const {rushId, mails} = req.body;

      const createCaller = createCallerFactory(RushFraudAppRouter);
      const caller = createCaller({});
      await caller.registerRushFraudEmail({rushId, mails});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.registerRushFraudTrade,
    requireClientKey,
    async (req: Request, res: Response) => {
      const {rushId, trades} = req.body;

      const createCaller = createCallerFactory(RushFraudAppRouter);
      const caller = createCaller({});
      await caller.registerRushFraudTrade({rushId, trades});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.CleanUpRushFraud,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId} = req.body;

      const createCaller = createCallerFactory(RushFraudAppRouter);
      const caller = createCaller({});
      await caller.cleanUpRush({rushId});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.get(
    RouteEnum.GetRushFraud,
    requireFrontendKey,
    async (req: Request, res: Response) => {
      const {rushName} = req.query as {rushName: string};

      const createCaller = createCallerFactory(RushFraudAppRouter);
      const caller = createCaller({});
      const rushFraud = await caller.getRushFraud({rushName});
      res.status(200).send(rushFraud);
    },
  );

  app.use(router);
};

export default setRushFraudRouter;
