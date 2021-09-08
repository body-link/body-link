import {
  bindEagerlyTo,
  bindLazilyTo,
  combineRoutes,
  createServer,
  httpListener,
  HttpServer,
  HttpStatus,
  r,
  RouteEffect,
  ServerIO,
  useContext,
} from '@marblejs/core';
import {
  eventBus,
  eventBusClient,
  EventBusClientToken,
  EventBusToken,
  messagingListener,
} from '@marblejs/messaging';
import { bodyParser$ } from '@marblejs/middleware-body';
import { logger$ } from '@marblejs/middleware-logger';
import * as E from 'fp-ts/Either';
import { flow } from 'fp-ts/function';
import * as io from 'fp-ts/IO';
import * as ro from 'rxjs/operators';
import { throwErrorAppHttp, withBody } from './common/response';
import { assistant, AssistantToken } from './dependencies/assistant/Assistant';
import {
  automationManager,
  automationManagerMiddleware$,
  AutomationManagerToken,
} from './dependencies/automation-manager/automation-manager';
import {
  googleClientOAuth2,
  GoogleClientOAuth2Token,
} from './dependencies/integrations/google/GoogleClientOAuth2';
import { KVStorage, KVStorageToken } from './dependencies/kv-storage/KVStorage';
import { recordManager, RecordManagerToken } from './dependencies/record-manager/RecordManager';
import { assistantReply$ } from './effects/assistant/assistantReply';
import { sleepAsAndroidPull$ } from './effects/automations/sleepAsAndroidPull';
import { handleError$ } from './effects/system/handleError';
import { getState } from './state';

const ef$: RouteEffect = r.pipe(
  r.matchPath('/1'),
  r.matchType('GET'),
  r.useEffect((req$, ctx) => {
    const client = useContext(GoogleClientOAuth2Token)(ctx.ask);
    return req$.pipe(
      ro.mergeMap(client.state.get),
      ro.map(flow(E.fold(throwErrorAppHttp(HttpStatus.BAD_REQUEST), withBody)))
    );
  })
);

const server: Promise<ServerIO<HttpServer>> = createServer({
  port: getState().port,
  listener: httpListener({
    middlewares: [logger$(), automationManagerMiddleware$],
    effects: [
      combineRoutes('/', {
        effects: [
          ef$,
          r.pipe(
            r.matchPath('/'),
            r.matchType('GET'),
            r.useEffect((req$) => req$.pipe(ro.map(() => ({ body: 'Hello!' }))))
          ),
        ],
        middlewares: [bodyParser$()],
      }),
    ],
  }),
  dependencies: [
    bindLazilyTo(GoogleClientOAuth2Token)(googleClientOAuth2),
    bindLazilyTo(AssistantToken)(assistant),
    bindLazilyTo(KVStorageToken)(KVStorage),
    bindEagerlyTo(RecordManagerToken)(recordManager),
    bindEagerlyTo(EventBusToken)(
      eventBus({
        listener: messagingListener({
          effects: [assistantReply$, sleepAsAndroidPull$],
          error$: handleError$,
        }),
      })
    ),
    bindEagerlyTo(EventBusClientToken)(eventBusClient),
    bindEagerlyTo(AutomationManagerToken)(automationManager),
  ],
});

const main: io.IO<void> = async () => (await server)();

main();
