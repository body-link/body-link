import { Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Signal<P1 = void, P2 = P1, R = void> {
  $: Observable<P2>;
  _: (...args: P1 extends void ? unknown[] : [P1]) => () => R;
  (...args: P1 extends void ? unknown[] : [P1]): R;
}

export type SignalModifier<P1, P2, R> = (emit: (payloadOutput: P2) => void, payloadInput: P1) => R;

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface SignalWave {
  signal: Signal<unknown>;
  modifier?: SignalModifier<unknown, unknown, unknown>;
  payload: unknown;
}
