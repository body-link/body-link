/* eslint-disable @typescript-eslint/no-explicit-any */
import { Lens, structEq } from '../lens';
import { AbstractReadOnlyAtom } from './ImplReadOnlyAtom';
import { Atom } from './types';
import { SimpleCache } from '../simple-cache';
import { Subscriber, Subscription } from 'rxjs';
import { isText } from '@body-link/type-guards';

export abstract class AbstractAtom<T> extends AbstractReadOnlyAtom<T> implements Atom<T> {
  private readonly _lensedAtomsCache: SimpleCache<Lens<any, any>, LensedAtom<any, any>> = new SimpleCache(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    (lens) => new LensedAtom(this, lens, structEq)
  );

  abstract modify(updateFn: (x: T) => T): void;

  public set(x: T): void {
    this.modify(() => x);
  }

  public lens<U>(lens: Lens<T, U>): Atom<U>;
  public lens<K extends keyof T>(k: K): Atom<T[K]>;
  public lens<U>(arg1: Lens<T, U> | string, ...args: string[]): Atom<any> {
    let mainLens = isText(arg1) ? Lens.key(arg1) : arg1;
    if (args.length > 0) {
      const lensesToCompose = args.filter(isText);
      if (lensesToCompose.length > 0) {
        mainLens = Lens.compose(mainLens, ...lensesToCompose.map((k) => Lens.key(k)));
      }
    }
    return this._lensedAtomsCache.getOrCreate(mainLens);
  }
}

export class ImplAtom<T> extends AbstractAtom<T> {
  public constructor(initialValue: T) {
    super(initialValue);
  }

  public get(): T {
    return this.getValue();
  }

  public modify(updateFn: (x: T) => T): void {
    const prev = this.getValue();
    const next = updateFn(prev);
    if (!structEq(prev, next)) {
      this.next(next);
    }
  }

  public set(next: T): void {
    const prev = this.getValue();
    if (!structEq(prev, next)) {
      this.next(next);
    }
  }
}

class LensedAtom<TSource, TDest> extends AbstractAtom<TDest> {
  private _subscription: Subscription | null = null;
  private _refCount: number = 0;
  private _source: Atom<TSource>;
  private _lens: Lens<TSource, TDest>;
  private readonly _eq: (x: TDest, y: TDest) => boolean;

  public constructor(
    source: Atom<TSource>,
    lens: Lens<TSource, TDest>,
    eq: (x: TDest, y: TDest) => boolean = structEq
  ) {
    // @NOTE this is a major hack to optimize for not calling
    // _lens.get the extra time here. This makes the underlying
    // BehaviorSubject to have an `undefined` for it's current value.
    //
    // But it works because before somebody subscribes to this
    // atom, it will subscribe to the _source (which we expect to be a
    // descendant of BehaviorSubject as well), which will emit a
    // value right away, triggering our _onSourceValue.
    super(undefined!);
    this._source = source;
    this._lens = lens;
    this._eq = eq;
  }

  public get(): TDest {
    // Optimization: in case we're already subscribed to the
    // source atom, the BehaviorSubject.getValue will return
    // an up-to-date computed lens value.
    //
    // This way we don't need to recalculate the lens value
    // every time.
    return this._subscription ? this.getValue() : this._lens.get(this._source.get());
  }

  public modify(updateFn: (x: TDest) => TDest): void {
    this._source.modify((x) => this._lens.modify(updateFn, x));
  }

  public set(newValue: TDest): void {
    this._source.modify((x) => this._lens.set(newValue, x));
  }

  private _onSourceValue(x: TSource): void {
    const prev = this.getValue();
    const next = this._lens.get(x);
    if (!this._eq(prev, next)) {
      this.next(next);
    }
  }

  // Rx method overrides
  private _subscribe(subscriber: Subscriber<TDest>): Subscription {
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

  public unsubscribe(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
    this._refCount = 0;
    super.unsubscribe();
  }
}
