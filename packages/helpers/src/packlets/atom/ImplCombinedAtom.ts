/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineLatest, Subscriber, Subscription } from 'rxjs';
import { ReadOnlyAtom } from './types';
import { structEq } from '../lens';
import { AbstractReadOnlyAtom } from './ImplReadOnlyAtom';

export class ImplCombinedAtom<TResult> extends AbstractReadOnlyAtom<TResult> {
  private _subscription: Subscription | null = null;
  private _refCount: number = 0;
  private _sources: ReadOnlyAtom<any>[];
  private readonly _combineFn: (xs: any[]) => TResult;
  private readonly _eq: (x: TResult, y: TResult) => boolean;

  public constructor(
    sources: ReadOnlyAtom<any>[],
    combineFn: (xs: any[]) => TResult,
    eq: (x: TResult, y: TResult) => boolean = structEq
  ) {
    // @NOTE this is a major hack to optimize for not calling
    // _combineFn and .get for each source the extra time here.
    // This makes the underlying BehaviorSubject to have an
    // `undefined` for it's current value.
    //
    // But it works because before somebody subscribes to this
    // atom, it will subscribe to the _source (which we expect to be a
    // descendant of BehaviorSubject as well), which will emit a
    // value right away, triggering our _onSourceValue.
    super(undefined!);
    this._sources = sources;
    this._combineFn = combineFn;
    this._eq = eq;
  }

  public get(): TResult {
    // Optimization: in case we're already subscribed to
    // source atoms, the BehaviorSubject.getValue will return
    // an up-to-date computed view value.
    //
    // This way we don't need to recalculate the view value
    // every time.
    return this._subscription ? this.getValue() : this._combineFn(this._sources.map((x) => x.get()));
  }

  private _onSourceValues(xs: any[]): void {
    const prev = this.getValue();
    const next = this._combineFn(xs);
    if (!this._eq(prev, next)) {
      this.next(next);
    }
  }

  // Rx method overrides
  private _subscribe(subscriber: Subscriber<TResult>): Subscription {
    // tslint:disable-line function-name
    if (!this._subscription) {
      this._subscription = combineLatest(this._sources).subscribe((xs) => this._onSourceValues(xs));
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
