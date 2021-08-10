import { marbles } from 'rxjs-marbles/jest';
import { Compiler, Expect, expecter } from 'ts-snippet';
import { createFig, toFig } from './fig';

describe('createFig types', () => {
  let expectSnippet: (code: string) => Expect;

  beforeAll(() => {
    expectSnippet = expecter(
      (code) => `
      import { createFig } from "./fig";
      import { TOption } from '@body-link/type-guards';
      const fig = ${code};
    `,
      new Compiler({ strict: true }, __dirname)
    );
  });

  it('should satisfy expected data types', () => {
    expectSnippet('createFig()').toInfer('fig', 'IFig<unknown>');
    expectSnippet('createFig<number>()').toInfer('fig', 'IFig<TOption<number>>');

    expectSnippet('createFig({})').toInfer('fig', 'IFig<unknown>');
    expectSnippet('createFig<string>({})').toInfer('fig', 'IFig<TOption<string>>');

    expectSnippet('createFig({ inProgress: true })').toInfer('fig', 'IFig<unknown>');
    expectSnippet('createFig<number>({ inProgress: true })').toInfer('fig', 'IFig<TOption<number>>');

    expectSnippet('createFig({ value: 0 })').toInfer('fig', 'IFig<number>');
    expectSnippet('createFig<number>({ value: 0 })').toInfer('fig', 'IFig<number>');

    expectSnippet('createFig({ value: 0, inProgress: true })').toInfer('fig', 'IFig<number>');
    expectSnippet('createFig<number>({ value: 0, inProgress: true })').toInfer('fig', 'IFig<number>');

    expectSnippet('createFig<string>({ value: 0 })').toFail();
    expectSnippet('createFig<string | number>({ value: 0 })').toInfer('fig', 'IFig<string | number>');
  });
});

describe('createFig', () => {
  it('should create default fig', () =>
    expect(createFig()).toStrictEqual({
      value: undefined,
      inProgress: false,
    }));

  it('should create partial fig', () =>
    expect(createFig({ value: 2, inProgress: true })).toStrictEqual({
      value: 2,
      inProgress: true,
    }));

  it('should create error fig', () =>
    expect(createFig({ error: new Error('error') })).toStrictEqual({
      value: undefined,
      inProgress: false,
      error: new Error('error'),
    }));
});

describe('toFig', () => {
  it(
    'should map single value to fig',
    marbles((m) => {
      const sourceValues = { b: 1 };
      const expectedValues = {
        a: createFig<number>({ inProgress: true }),
        b: createFig({ value: sourceValues.b }),
      };

      const source = m.cold('   ------b|', sourceValues);
      const subs = '            ^------!';
      const expected = m.cold(' a-----b|', expectedValues);

      const destination = toFig(source, undefined);
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should map error to fig',
    marbles((m) => {
      const expectedValues = {
        a: createFig({ inProgress: true }),
        b: createFig({ error: new Error('error') }),
      };

      const source = m.cold('   ------#');
      const subs = '            ^-----!';
      const expected = m.cold(' a-----(b|)', expectedValues);

      const destination = toFig(source, undefined);
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should pass error down the stream',
    marbles((m) => {
      const expectedValues = {
        a: createFig({ inProgress: true }),
        b: createFig({ error: new Error('error') }),
      };

      const source = m.cold('   ------#');
      const subs = '            ^-----!';
      const expected = m.cold(' a-----(b#)', expectedValues);

      const destination = toFig(source, undefined, { errorHandlingStrategy: 'pass' });
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should map multiple values to fig (longProgress)',
    marbles((m) => {
      const defaultValue = 777;
      const sourceValues = { b: 1, c: 2, d: 3 };
      const expectedValues = {
        a: createFig({ value: defaultValue, inProgress: true }),
        b: createFig({ value: sourceValues.b, inProgress: true }),
        c: createFig({ value: sourceValues.c, inProgress: true }),
        d: createFig({ value: sourceValues.d, inProgress: true }),
        e: createFig({ value: sourceValues.d }),
      };

      const source = m.cold('   -b-c-d-|', sourceValues);
      const subs = '            ^------!';
      const expected = m.cold(' ab-c-d-(e|)', expectedValues);

      const destination = toFig(source, defaultValue, { longProgress: true });
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should skip value in fig',
    marbles((m) => {
      const defaultValue = 'hello!';
      const expectedValues = {
        a: createFig({ value: defaultValue, inProgress: true }),
        b: createFig({ value: defaultValue }),
      };

      const source = m.cold('   ---a-a-|');
      const subs = '            ^------!';
      const expected = m.cold(' a--a-a-(b|)', expectedValues);

      const destination = toFig(source, defaultValue, { skipValue: true });
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should skip error in fig',
    marbles((m) => {
      const expectedValues = {
        a: createFig({ inProgress: true }),
        b: createFig(),
      };

      const source = m.cold('   -------#');
      const subs = '            ^------!';
      const expected = m.cold(' a------(b|)', expectedValues);

      const destination = toFig(source, undefined, { skipError: true });
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should skip progress in fig',
    marbles((m) => {
      const expectedValues = {
        a: createFig(),
        b: createFig({ value: 'b' }),
      };

      const source = m.cold('   ---b---|');
      const subs = '            ^------!';
      const expected = m.cold(' a--b---|', expectedValues);

      const destination = toFig(source, undefined, { skipProgress: true });
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should map empty to fig',
    marbles((m) => {
      const expectedValues = {
        a: createFig({ inProgress: true }),
        b: createFig(),
      };

      const source = m.cold('   -------|');
      const subs = '            ^------!';
      const expected = m.cold(' a------(b|)', expectedValues);

      const destination = toFig(source, undefined);
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    'should throw error if skip every property',
    marbles((m) => {
      const destination = toFig(m.cold('a|'), undefined, {
        skipError: true,
        skipValue: true,
        skipProgress: true,
      });
      m.expect(destination).toBeObservable(
        m.cold('#', {}, new Error("You don't need to use IFig if you skip every its' property"))
      );
    })
  );
});
