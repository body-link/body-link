import { marbles } from 'rxjs-marbles/jest';
import { TOption } from '@body-link/type-guards';
import { Compiler, Expect, expecter } from 'ts-snippet';
import { Atom } from '../packlets/atom';
import { createFig } from './fig';
import { atomFigProjection } from './atomFigProjection';

describe('atomFigProjection types', () => {
  let expectSnippet: (code: string) => Expect;

  beforeAll(() => {
    expectSnippet = expecter(
      (code) => `
      import { of } from "rxjs";
      import { map } from "rxjs/operators";
      import { Atom } from '../packlets/atom';
      import { createFig } from './fig';
      import { atomFigProjection } from './atomFigProjection';
      const fig$ = Atom.create(${code});
      const res$ = of(1).pipe(
        atomFigProjection(fig$),
        map(v => v + 1)
      );
    `,
      new Compiler({ strict: true, allowSyntheticDefaultImports: true }, __dirname)
    );
  });

  it('should satisfy expected data types', () => {
    expectSnippet('createFig()').toInfer('res$', 'Observable<number>');
    expectSnippet('createFig<number>()').toInfer('res$', 'Observable<number>');
    expectSnippet('createFig<string>()').toFail();
    expectSnippet('createFig<string | number>()').toInfer('res$', 'Observable<number>');
    expectSnippet('createFig({ inProgress: true })').toInfer('res$', 'Observable<number>');
    expectSnippet('createFig({ value: 3 })').toInfer('res$', 'Observable<number>');
    expectSnippet('createFig({ value: "text" })').toFail();
  });
});

describe('atomFigProjection', () => {
  it(
    'should project single value to fig',
    marbles((m) => {
      const sourceValues = { c: 873 };
      const expectedValues = {
        a: createFig<number>(),
        b: createFig<number>({ inProgress: true }),
        c: createFig<number>({ value: sourceValues.c }),
      };

      const source = m.cold('   -----c|   ', sourceValues);
      const subs = '            ^-----!   ';
      const figBefore = m.hot(' (ab)-c----', expectedValues);
      const figAfter = m.hot('  b----c----', expectedValues);

      const fig$ = Atom.create(createFig<TOption<number>>());
      const destination = source.pipe(atomFigProjection(fig$));

      m.expect(fig$).toBeObservable(figBefore);
      m.expect(destination).toBeObservable(source);
      m.expect(fig$).toBeObservable(figAfter);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should project multiple values to fig (longProgress)',
    marbles((m) => {
      const sourceValues = { c: 873, d: 9 };
      const expectedValues = {
        a: createFig<number>(),
        b: createFig<number>({ inProgress: true }),
        c: createFig<number>({ value: sourceValues.c, inProgress: true }),
        d: createFig<number>({ value: sourceValues.d, inProgress: true }),
        e: createFig<number>({ value: sourceValues.d }),
      };

      const source = m.cold('   -----c-d-|  ', sourceValues);
      const subs = '            ^--------!  ';
      const figBefore = m.hot(' (ab)-c-d-e--', expectedValues);
      const figAfter = m.hot('  b----c-d-e--', expectedValues);

      const fig$ = Atom.create(createFig<TOption<number>>());
      const destination = source.pipe(atomFigProjection(fig$, { longProgress: true }));

      m.expect(fig$).toBeObservable(figBefore);
      m.expect(destination).toBeObservable(source);
      m.expect(fig$).toBeObservable(figAfter);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should project error to fig',
    marbles((m) => {
      const expectedValues = {
        a: createFig(),
        b: createFig({ inProgress: true }),
        c: createFig({ error: new Error('error') }),
      };

      const source = m.cold('   -----#   ');
      const sourceE = m.cold('  -----|   ');
      const subs = '            ^----!   ';
      const figBefore = m.hot(' (ab)-c---', expectedValues);
      const figAfter = m.hot('  b----c---', expectedValues);

      const fig$ = Atom.create(createFig());
      const destination = source.pipe(atomFigProjection(fig$));

      m.expect(fig$).toBeObservable(figBefore);
      m.expect(destination).toBeObservable(sourceE);
      m.expect(fig$).toBeObservable(figAfter);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should pass error down the stream',
    marbles((m) => {
      const expectedValues = {
        a: createFig(),
        b: createFig({ inProgress: true }),
        c: createFig({ error: new Error('error') }),
      };

      const source = m.cold('   -----#   ');
      const subs = '            ^----!   ';
      const figBefore = m.hot(' (ab)-c---', expectedValues);
      const figAfter = m.hot('  b----c---', expectedValues);

      const fig$ = Atom.create(createFig());
      const destination = source.pipe(atomFigProjection(fig$, { errorHandlingStrategy: 'pass' }));

      m.expect(fig$).toBeObservable(figBefore);
      m.expect(destination).toBeObservable(source);
      m.expect(fig$).toBeObservable(figAfter);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should skip projection of value to fig',
    marbles((m) => {
      const sourceValues = { c: 873 };
      const expectedValues = {
        a: createFig(),
        b: createFig({ inProgress: true }),
      };

      const source = m.cold('   -----c|   ', sourceValues);
      const subs = '            ^-----!   ';
      const figBefore = m.hot(' (ab)--a---', expectedValues);
      const figAfter = m.hot('  b-----a---', expectedValues);

      const fig$ = Atom.create(createFig());
      const destination = source.pipe(atomFigProjection(fig$, { skipValue: true }));

      m.expect(fig$).toBeObservable(figBefore);
      m.expect(destination).toBeObservable(source);
      m.expect(fig$).toBeObservable(figAfter);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should skip projection of error to fig',
    marbles((m) => {
      const expectedValues = {
        a: createFig(),
        b: createFig({ inProgress: true }),
      };

      const source = m.cold('   -----#   ');
      const sourceE = m.cold('  -----|   ');
      const subs = '            ^----!   ';
      const figBefore = m.hot(' (ab)-a---', expectedValues);
      const figAfter = m.hot('  b----a---', expectedValues);

      const fig$ = Atom.create(createFig());
      const destination = source.pipe(atomFigProjection(fig$, { skipError: true }));

      m.expect(fig$).toBeObservable(figBefore);
      m.expect(destination).toBeObservable(sourceE);
      m.expect(fig$).toBeObservable(figAfter);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should skip projection of progress to fig',
    marbles((m) => {
      const sourceValues = { c: 873 };
      const expectedValues = {
        a: createFig(),
        c: createFig({ value: sourceValues.c }),
      };

      const source = m.cold('   -----c|   ', sourceValues);
      const subs = '            ^-----!   ';
      const figBefore = m.hot(' a----c----', expectedValues);
      const figAfter = m.hot('  a----c----', expectedValues);

      const fig$ = Atom.create(createFig());
      const destination = source.pipe(atomFigProjection(fig$, { skipProgress: true }));

      m.expect(fig$).toBeObservable(figBefore);
      m.expect(destination).toBeObservable(source);
      m.expect(fig$).toBeObservable(figAfter);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should projection empty to fig',
    marbles((m) => {
      const expectedValues = {
        a: createFig(),
        b: createFig({ inProgress: true }),
      };

      const source = m.cold('   ------|   ');
      const subs = '            ^-----!   ';
      const figBefore = m.hot(' (ab)--a---', expectedValues);
      const figAfter = m.hot('  b-----a---', expectedValues);

      const fig$ = Atom.create(createFig());
      const destination = source.pipe(atomFigProjection(fig$));

      m.expect(fig$).toBeObservable(figBefore);
      m.expect(destination).toBeObservable(source);
      m.expect(fig$).toBeObservable(figAfter);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should throw error if skip every property',
    marbles((m) => {
      const fig$ = Atom.create(createFig());
      const destination = m.hot('a|').pipe(
        atomFigProjection(fig$, {
          skipError: true,
          skipValue: true,
          skipProgress: true,
        })
      );
      m.expect(destination).toBeObservable(
        m.cold('#', {}, new Error("You don't need to use IFig if you skip every its' property"))
      );
      m.expect(fig$).toBeObservable(m.hot('a', { a: createFig() }));
    })
  );
});
