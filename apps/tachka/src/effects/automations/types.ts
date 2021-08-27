import { event } from '@marblejs/core';
import { t } from '../../common/modules';
import { tr } from '../../data/io-ts-refine';

export enum AutomationCommandType {
  SLEEP_AS_ANDROID_PULL = 'SLEEP_AS_ANDROID_PULL',
}

// eslint-disable-next-line @rushstack/typedef-var
export const SleepAsAndroidPullCommand = event(AutomationCommandType.SLEEP_AS_ANDROID_PULL)(
  t.type({
    owner: tr.Slug,
    group: tr.Slug,
    tsInitialFrom: tr.MillisecondsTimestamp,
  })
);

export enum AutomationEventType {
  SLEEP_AS_ANDROID_PULLED = 'SLEEP_AS_ANDROID_PULLED',
}

// eslint-disable-next-line @rushstack/typedef-var
export const SleepAsAndroidPulledEvent = event(AutomationEventType.SLEEP_AS_ANDROID_PULLED)();
