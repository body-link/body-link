import { BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { filter, map, share, take } from 'rxjs/operators';
import { createFig, IFig, toFig } from './fig';
import { Atom } from '../packlets/atom';
import { cs, Signal } from '../packlets/rxjs-signal';

export interface IAtomCacheParams<T> {
  value$: Atom<T>;
  getValue$: Observable<T>;
  shouldLoad: (value: T) => boolean;
}

export class AtomCache<T> extends BehaviorSubject<IFig<T>> {
  private readonly _sub: Subscription;
  private readonly _shouldLoad: (value: T) => boolean;

  public readonly value$: Atom<T>;
  public readonly getValue$: Observable<T>;
  public readonly load: Signal<void, void, Observable<IFig<T>>> = cs<void, void, Observable<IFig<T>>>(
    (emit) => {
      const fig$ = toFig(this.getValue$.pipe(take(1)), this.value.value).pipe(share());
      this._sub.add(fig$.subscribe((v) => this.next(v)));
      emit();
      return fig$;
    }
  );
  public readonly loaded$: Observable<T>;

  public constructor(params: IAtomCacheParams<T>) {
    super(AtomCache._createState(params));

    const { value$, getValue$, shouldLoad } = params;

    this._sub = value$.subscribe((next) => {
      if (this.value.value !== next) {
        this.next(createFig<T>({ value: next }));
      }
    });
    this._shouldLoad = shouldLoad;

    this.value$ = value$;
    this.getValue$ = getValue$;
    this.loaded$ = this.pipe(
      filter((fig) => !shouldLoad(fig.value)),
      map((fig) => fig.value),
      take(1)
    );
  }

  public destroy(): void {
    this._sub.unsubscribe();
  }

  private static _createState<T>(params: IAtomCacheParams<T>): IFig<T> {
    const value = params.value$.get();
    return createFig<T>({ inProgress: params.shouldLoad(value), value });
  }

  private _subscribe(subscriber: Subscriber<IFig<T>>): Subscription {
    if (this._shouldLoad(this.value.value)) {
      this.load();
    }
    // @ts-ignore
    return super._subscribe(subscriber);
  }
}
