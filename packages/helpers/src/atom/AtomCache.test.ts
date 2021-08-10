import { marbles } from 'rxjs-marbles/jest';
import { lastValueFrom, Observable, of } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { Atom } from '../packlets/atom';
import { AtomCache } from './AtomCache';
import { createFig } from './fig';

describe('AtomCache', () => {
  it('should return cached fig on the second subscribe', async () => {
    const spyShouldLoad = jest.fn((v) => v);
    const defaultValue = { n: 1 };
    const expectedValues: number[] = [];

    const value$ = Atom.create(defaultValue);
    const atomCache = new AtomCache({
      getValue$: new Observable((subscriber) => {
        setTimeout(() => {
          const value = Date.now();
          expectedValues.push(value);
          subscriber.next(value);
          subscriber.complete();
        }, 4);
      }),
      value$,
      shouldLoad: (value) => spyShouldLoad(value) === defaultValue,
    });

    const result1 = await lastValueFrom(atomCache.pipe(take(2), toArray()));
    expect(result1.length).toBe(2);
    expect(expectedValues.length).toBe(1);
    expect(result1).toStrictEqual([
      createFig({ value: defaultValue, inProgress: true }),
      createFig({ value: expectedValues[0] }),
    ]);
    expect(spyShouldLoad).toBeCalledTimes(2);

    const result2 = await lastValueFrom(atomCache.pipe(take(1), toArray()));
    expect(result2.length).toBe(1);
    expect(expectedValues.length).toBe(1);
    expect(result2).toStrictEqual([createFig({ value: expectedValues[0] })]);
    expect(spyShouldLoad).toBeCalledTimes(3);
  });

  it('should return loaded value', async () => {
    const defaultValue = { n: 1 };
    const expectedValues: number[] = [];

    const value$ = Atom.create(defaultValue);
    const atomCache = new AtomCache({
      getValue$: new Observable((subscriber) => {
        setTimeout(() => {
          const value = Date.now();
          expectedValues.push(value);
          subscriber.next(value);
          subscriber.complete();
        }, 4);
      }),
      value$,
      shouldLoad: (value) => value === defaultValue,
    });

    const result = await lastValueFrom(atomCache.loaded$);
    expect([result]).toStrictEqual(expectedValues);
  });

  it('should update cache when value$ changes', () => {
    const defaultValue = { x: 1 };
    const value$ = Atom.create(defaultValue);
    const atomCache = new AtomCache({
      getValue$: of({ x: 2 }),
      value$,
      shouldLoad: (value) => value === defaultValue,
    });

    expect(atomCache.getValue()).toStrictEqual(createFig({ value: defaultValue, inProgress: true }));
    value$.set({ x: 777 });
    const x777 = atomCache.getValue();
    expect(x777).toStrictEqual(createFig({ value: { x: 777 } }));
    value$.set({ x: 777 });
    expect(atomCache.getValue()).toBe(x777);
    value$.set({ x: 63 });
    expect(atomCache.getValue()).toStrictEqual(createFig({ value: { x: 63 } }));
  });

  it(
    'should return Observable<IFig> from load()',
    marbles((m) => {
      const defaultValue = 900;
      const sourceValues = { b: 1 };
      const expectedValues = {
        a: createFig({ value: defaultValue, inProgress: true }),
        b: createFig({ value: sourceValues.b }),
      };

      const source = m.cold('   ------b|', sourceValues);
      const subs = '            ^-----!';
      const expected = m.hot('  ------(b|)', expectedValues);

      const atomCache = new AtomCache({
        getValue$: source,
        value$: Atom.create(defaultValue),
        shouldLoad: (value) => value === defaultValue,
      });

      const destination = atomCache.load();
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it('should unsubscribe on destroy', () => {
    const defaultValue = 1;
    const value$ = Atom.create(defaultValue);
    const atomCache = new AtomCache({
      getValue$: of(2),
      value$,
      shouldLoad: (value) => value === defaultValue,
    });

    atomCache.destroy();
    value$.set(777);
    expect(atomCache.getValue()).toStrictEqual(createFig({ value: defaultValue, inProgress: true }));
  });
});
