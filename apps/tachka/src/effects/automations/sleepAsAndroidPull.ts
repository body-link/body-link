import { matchEvent, useContext } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { nanoid } from 'nanoid';
import * as r from 'rxjs';
import * as ro from 'rxjs/operators';
import { eitherMapLeftToErrorDecode, throwErrorApp } from '../../common/utils';
import { RecordNumber, RecordNumberData } from '../../data/record/RecordNumber';
import { ReplyEntry } from '../../data/ReplyEntry';
import { RecordManagerToken } from '../../dependencies/record-manager/RecordManager';
import { assist } from '../../operators/assist';
import { validateEvent } from '../../operators/validateEvent';
import { AutomationCommandType, SleepAsAndroidPullCommand, SleepAsAndroidPulledEvent } from './types';

export const sleepAsAndroidPull$: MsgEffect = (event$, ctx) => {
  const recordManager = useContext(RecordManagerToken)(ctx.ask);
  const subject = AutomationCommandType.SLEEP_AS_ANDROID_PULL;
  return pipe(
    event$,
    matchEvent(SleepAsAndroidPullCommand),
    assist(
      ReplyEntry.build({
        subject,
        action: 'event validation',
      }),
      validateEvent(SleepAsAndroidPullCommand)
    ),
    assist(
      ReplyEntry.build({
        subject,
        action: 'work',
      }),
      (event) =>
        pipe(
          r.of(event.payload),
          ro.map(({ owner, group, tsInitialFrom }) =>
            pipe(
              RecordNumber.create({
                id: nanoid(),
                timestamp: Date.now(),
                offset: undefined,
                duration: 0,
                group,
                owner,
                source: 'automation-sleep-as-android',
                type: 'RecordNumber',
                data: tsInitialFrom as unknown as RecordNumberData,
              }),
              eitherMapLeftToErrorDecode,
              E.getOrElseW(throwErrorApp)
            )
          ),
          ro.mergeMap(recordManager.save),
          ro.mergeMap(() => [
            reply(event)(SleepAsAndroidPulledEvent.create()),
            SleepAsAndroidPulledEvent.create(),
          ])
        )
    )
  );
};
