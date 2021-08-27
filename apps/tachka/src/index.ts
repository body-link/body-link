import {
  bindEagerlyTo,
  bindLazilyTo,
  combineRoutes,
  createServer,
  httpListener,
  HttpServer,
  r,
  ServerIO,
} from '@marblejs/core';
import {
  eventBus,
  eventBusClient,
  EventBusClientToken,
  EventBusToken,
  messagingListener,
} from '@marblejs/messaging';
import { IO } from 'fp-ts/IO';
import { logger$ } from '@marblejs/middleware-logger';
import { bodyParser$ } from '@marblejs/middleware-body';
import { map } from 'rxjs/operators';

import { getState } from './state';
import { KVStorage, KVStorageToken } from './dependencies/kv-storage/KVStorage';
import { assistant, AssistantToken } from './dependencies/assistant/Assistant';
import { recordManager, RecordManagerToken } from './dependencies/record-manager/RecordManager';
import {
  automationManager,
  automationManagerMiddleware$,
  AutomationManagerToken,
} from './dependencies/automation-manager/automation-manager';
import { assistantReply$ } from './effects/assistant/assistantReply';
import { handleError$ } from './effects/system/handleError';
import { sleepAsAndroidPull$ } from './effects/automations/sleepAsAndroidPull';

const server: Promise<ServerIO<HttpServer>> = createServer({
  port: getState().port,
  listener: httpListener({
    middlewares: [logger$(), automationManagerMiddleware$],
    effects: [
      combineRoutes('/', {
        effects: [
          r.pipe(
            r.matchPath('/1'),
            r.matchType('GET'),
            r.useEffect((req$) => req$.pipe(map(() => ({ body: '11111111' }))))
          ),
          r.pipe(
            r.matchPath('/'),
            r.matchType('GET'),
            r.useEffect((req$) => req$.pipe(map(() => ({ body: 'Hello!' }))))
          ),
        ],
        middlewares: [bodyParser$()],
      }),
    ],
  }),
  dependencies: [
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

const run: IO<void> = async () => (await server)();

run();
