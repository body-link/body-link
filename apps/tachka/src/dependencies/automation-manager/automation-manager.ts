import {
  createContextToken,
  createReader,
  HttpMiddlewareEffect,
  HttpRequest,
  useContext,
} from '@marblejs/core';
import { EventBusClientToken } from '@marblejs/messaging';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Agenda, Job } from 'agenda';
import Agendash from 'agendash';
import express, { Express } from 'express';
import { getState } from '../../state';
import { AutomationCommandType } from '../../effects/automations/types';

const ROUTE: string = '/dash';

// eslint-disable-next-line @rushstack/typedef-var
export const AutomationManagerToken = createContextToken<(req: HttpRequest) => boolean>('AutomationManager');

const atms: { type: string }[] = [
  {
    type: AutomationCommandType.SLEEP_AS_ANDROID_PULL,
  },
];

// eslint-disable-next-line @rushstack/typedef-var
export const automationManager = createReader(async (ask) => {
  const client = useContext(EventBusClientToken)(ask);
  const agenda: Agenda = new Agenda({ db: { address: getState().mongoURI } });

  atms.forEach((a) => {
    agenda.define(a.type, { concurrency: 1 }, (job: Job) =>
      firstValueFrom(
        client.send({
          type: a.type,
          payload: job.attrs.data,
        })
      )
    );
  });

  await agenda.start();

  const app: Express = express();
  app.use(ROUTE, Agendash(agenda, { middleware: 'express' }));

  return (req: HttpRequest) => {
    if (req.url.startsWith(ROUTE)) {
      const s = req.response.send;
      req.response.send = (body) => s({ body });
      app(req, req.response);
      return false;
    }
    return true;
  };
});

export const automationManagerMiddleware$: HttpMiddlewareEffect = (req$, ctx) =>
  req$.pipe(filter(useContext(AutomationManagerToken)(ctx.ask)));
