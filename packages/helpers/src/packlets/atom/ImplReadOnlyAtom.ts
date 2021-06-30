import { TOption } from '@body-link/type-guards';
import { BehaviorSubject, Subscriber, Subscription } from 'rxjs';
import { Lens, Prism, structEq } from '../lens';
import { SimpleCache } from '../simple-cache';
import { ReadOnlyAtom } from './types';

export abstract class AbstractReadOnlyAtom<T> extends BehaviorSubject<T> implements ReadOnlyAtom<T> {
  private readonly _viewedAtomsCache: SimpleCache<Lens<T, any>, ReadOnlyAtom<any>> = new SimpleCache(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    (lens) => new ImplReadOnlyAtom(this, lens.get)
  );

  abstract get(): T;

  public view(): ReadOnlyAtom<T>;
  public view<U>(getter: (x: T) => U): ReadOnlyAtom<U>;
  public view<U>(lens: Lens<T, U>): ReadOnlyAtom<U>;
  public view<U>(prism: Prism<T, U>): ReadOnlyAtom<TOption<U>>;
  public view<K extends keyof T>(k: K): ReadOnlyAtom<T[K]>;

  public view<U>(...args: any[]): ReadOnlyAtom<any> {
    if (args[0] === undefined) {
      return this;
    } else if (typeof args[0] === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return new ImplReadOnlyAtom<T, U>(this, args[0] as (x: T) => U);
    } else if (typeof args[0] === 'string') {
      const lens = Lens.compose<T, U>(...args.map(Lens.key()));
      return this._viewedAtomsCache.getOrCreate(lens);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return new ImplReadOnlyAtom<T, U>(this, (x) => (args[0] as Lens<T, U>).get(x));
    }
  }
}

export class ImplReadOnlyAtom<TSource, TDest> extends AbstractReadOnlyAtom<TDest> {
  constructor(
    private _source: ReadOnlyAtom<TSource>,
    private _getter: (x: TSource) => TDest,
    private _eq: (x: TDest, y: TDest) => boolean = structEq
  ) {
    // @NOTE this is a major hack to optimize for not calling
    // _getter the extra time here. This makes the underlying
    // BehaviorSubject to have an `undefined` for it's current value.
    //
    // But it works because before somebody subscribes to this
    // atom, it will subscribe to the _source (which we expect to be a
    // descendant of BehaviorSubject as well), which will emit a
    // value right away, triggering our _onSourceValue.
    super(undefined!);
  }

  get() {
    // Optimization: in case we're already subscribed to the
    // source atom, the BehaviorSubject.getValue will return
    // an up-to-date computed lens value.
    //
    // This way we don't need to recalculate the view value
    // every time.
    return this._subscription ? this.getValue() : this._getter(this._source.get());
  }

  private _onSourceValue(x: TSource) {
    const prevValue = this.getValue();
    const next = this._getter(x);

    if (!this._eq(prevValue, next)) this.next(next);
  }

  private _subscription: Subscription | null = null;
  private _refCount = 0;

  // Rx method overrides
  _subscribe(subscriber: Subscriber<TDest>) {
    // tslint:disable-line function-name
    if (!this._subscription) {
      this._subscription = this._source.subscribe((x) => this._onSourceValue(x));
    }
    this._refCount++;

    const sub = new Subscription(() => {
      if (--this._refCount <= 0 && this._subscription) {
        this._subscription.unsubscribe();
        this._subscription = null;
      }
    });
    // @ts-ignore
    sub.add(super._subscribe(subscriber));

    return sub;
  }

  unsubscribe() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
    this._refCount = 0;

    super.unsubscribe();
  }
}
