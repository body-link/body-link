import { EventCodec, EventSchema, EventWithoutPayload, EventWithPayload } from '@marblejs/core';

export type EventAType<T extends EventCodec> = T extends EventSchema<never>
  ? EventWithoutPayload<T['_A']['type']>
  : EventWithPayload<T['_A']['payload'], T['_A']['type']>;
