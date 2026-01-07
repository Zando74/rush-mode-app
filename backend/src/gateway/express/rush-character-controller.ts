import express, {Request, Response} from 'express';
import {requireAdminKey} from './middleware/require-admin-key';
import {requireClientKey} from './middleware/require-client-key';
import {createCallerFactory} from '../../shared/infra/trpc/trpc';
import {RushCharactersAppRouter} from '../../rush-characters/infra/trpc/app';
import {RouteEnum} from './route-enum';
import {GetRushNamesHandler} from '../../rush-characters/app/query/get-rush-names.query';
import ContainerManager from '../../shared/infra/inversify/container-manager';
import {RushNameToIdRepository} from '../../shared/domain/port/rush-name-to-id-repository';
import {TYPES} from '../../shared/infra/inversify/type';
import {requireFrontendKey} from './middleware/require-frontend-key';

const router = express.Router();

const setRushCharactersRouter = (app: express.Application) => {
  router.post(
    RouteEnum.RegisterRushCharacters,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId, name} = req.body;

      const createCaller = createCallerFactory(RushCharactersAppRouter);
      const caller = createCaller({});
      await caller.registerRushCharacter({rushId, name});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.PlayersStatusUpdate,
    requireClientKey,
    async (req: Request, res: Response) => {
      const {rushId, characters} = req.body;

      const createCaller = createCallerFactory(RushCharactersAppRouter);
      const caller = createCaller({});
      await caller.playerStatusUpdate({
        rushId: rushId,
        characters,
      });

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.CloseRushCharacters,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId} = req.body;

      const createCaller = createCallerFactory(RushCharactersAppRouter);
      const caller = createCaller({});
      await caller.closeRush({rushId});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.OpenRushCharacters,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId} = req.body;

      const createCaller = createCallerFactory(RushCharactersAppRouter);
      const caller = createCaller({});
      await caller.openRush({rushId});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.post(
    RouteEnum.CleanUpRushCharacters,
    requireAdminKey,
    async (req: Request, res: Response) => {
      const {rushId} = req.body;

      const createCaller = createCallerFactory(RushCharactersAppRouter);
      const caller = createCaller({});
      await caller.cleanUpRush({rushId});

      res.status(200).send({
        message: 'ok',
      });
    },
  );

  router.get(
    RouteEnum.GetRushCharacters,
    requireFrontendKey,
    async (req: Request, res: Response) => {
      const {rushName} = req.query as {rushName: string};

      const createCaller = createCallerFactory(RushCharactersAppRouter);
      const caller = createCaller({});
      const rushCharacters = await caller.getRushCharacters({rushName});
      res.status(200).send(rushCharacters);
    },
  );

  router.get(
    RouteEnum.GetRushCharactersEvents,
    requireFrontendKey,
    async (req: Request, res: Response) => {
      const {rushName, from, to} = req.query as {
        rushName: string;
        from: string;
        to: string;
      };

      let isAdmin = false;

      if (req.headers['x-api-key'] === process.env.ADMIN_API_KEY) {
        isAdmin = true;
      }

      const createCaller = createCallerFactory(RushCharactersAppRouter);
      const caller = createCaller({});
      const rushCharactersEvents = await caller.getRushCharactersEvent({
        rushName,
        from: new Date(from),
        to: new Date(to),
        isAdmin,
      });
      res.status(200).send(rushCharactersEvents);
    },
  );

  router.get(
    RouteEnum.GetRushNames,
    requireFrontendKey,
    async (req: Request, res: Response) => {
      const getRushNamesHandler = new GetRushNamesHandler(
        ContainerManager.get<RushNameToIdRepository>(
          TYPES.RushNameToIdRepository,
        ),
      );
      const rushNames = await getRushNamesHandler.handle({});
      res.status(200).send(rushNames);
    },
  );

  app.use(router);
};

export default setRushCharactersRouter;
