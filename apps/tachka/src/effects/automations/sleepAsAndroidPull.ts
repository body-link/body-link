import { MsgEffect, reply } from '@marblejs/messaging';
import { matchEvent, useContext } from '@marblejs/core';
import { RecordManagerToken } from '../../dependencies/record-manager/RecordManager';
import { assist } from '../../operators/assist';
import { ReplyEntry } from '../../data/ReplyEntry';
import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { pipe } from 'fp-ts/function';
import { nanoid } from 'nanoid';
import { getOrElseW } from 'fp-ts/Either';
import { throwErrors } from '../../data/utils';
import { AutomationCommandType, SleepAsAndroidPullCommand, SleepAsAndroidPulledEvent } from './types';
import { RecordNumber, RecordNumberData } from '../../data/record/RecordNumber';
import { validateEvent } from '../../operators/validateEvent';

export const sleepAsAndroidPull$: MsgEffect = (event$, ctx) => {
  const recordManager = useContext(RecordManagerToken)(ctx.ask);
  const subject = AutomationCommandType.SLEEP_AS_ANDROID_PULL;
  return event$.pipe(
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
        of(event.payload).pipe(
          map(({ owner, group, tsInitialFrom }) =>
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
              getOrElseW(throwErrors)
            )
          ),
          mergeMap(recordManager.save),
          mergeMap(() => [
            reply(event)(SleepAsAndroidPulledEvent.create()),
            SleepAsAndroidPulledEvent.create(),
          ])
        )
    )
  );
};
