/* eslint-disable @typescript-eslint/no-explicit-any */
import { Lens } from './Lens';
import { structEq } from './utils';

function roundtrip<T, U>(name: string, l: Lens<T, U>, obj: T, oldVal: U, newVal: U): void {
  describe(`lens roundtrip: ${name}`, () => {
    it('get', () => expect(l.get(obj)).toEqual(oldVal));
    it('set', () => expect(l.get(l.set(newVal, obj))).toEqual(newVal));
  });
}

// tslint:disable-next-line
// see https://www.schoolofhaskell.com/school/to-infinity-and-beyond/pick-of-the-week/a-little-lens-starter-tutorial#the-lens-laws-
function testLaws<T, U>(l: Lens<T, U>, object: T, value1: U, value2: U, name: string): void {
  describe(`lens laws: ${name}`, () => {
    it('get-put', () => expect(structEq(object, l.set(l.get(object), object))).toBeTruthy());
    it('put-get', () => expect(structEq(value1, l.get(l.set(value1, object)))).toBeTruthy());
    it('put-put', () =>
      expect(structEq(l.set(value2, l.set(value1, object)), l.set(value2, object))).toBeTruthy());
  });
}

function testLens<O, P>(
  name: string,
  l: Lens<O, P>,
  obj: O,
  currentValue: P,
  newValue1: P,
  newValue2: P
): void {
  testLaws(l, obj, newValue1, newValue2, name);
  roundtrip(name, l, obj, currentValue, newValue1);
}

describe('identity', () => {
  testLens('basic', Lens.identity<any>(), 'any', 'any', 'other', 'another');
  testLens('composed', Lens.identity<any>(), 'any', 'any', 'other', 'another');
});

describe('json', () => {
  describe('key lenses are cached', () => {
    const a1 = Lens.key('a');
    const a2 = Lens.key('a');
    const a3 = Lens.key()('a');
    const b = Lens.key('b');
    expect(a1).toStrictEqual(a2);
    expect(a2).toStrictEqual(a3);
    expect(a1).not.toStrictEqual(b);
  });

  describe('index lenses are cached', () => {
    const a1 = Lens.index(0);
    const a2 = Lens.index(0);
    const a3 = Lens.index(1);
    expect(a1).toStrictEqual(a2);
    expect(a2).not.toStrictEqual(a3);
  });

  describe('simple', () => {
    const a = Lens.key('a');
    const b = Lens.key('b');
    const c = Lens.key('c');
    const i0 = Lens.index(0);
    const i1 = Lens.index(1);

    testLens('keys', a, { a: 'one' }, 'one', 'two', 'three');

    testLens('indices', i0, ['one'], 'one', 'two', 'three');

    testLens(
      'composed',
      a.compose(i0).compose(b).compose(i1).compose(c),
      { a: [{ b: ['boo', { c: 'one' }] }] },
      'one',
      'two',
      'three'
    );

    testLens(
      'composed, right associative',
      a.compose(i0.compose(b.compose(i1.compose(c)))),
      { a: [{ b: ['boo', { c: 'one' }] }] },
      'one',
      'two',
      'three'
    );

    testLens(
      'composed with Lens.compose',
      Lens.compose(a, i0, b, i1, c),
      { a: [{ b: ['boo', { c: 'one' }] }] },
      'one',
      'two',
      'three'
    );
  });

  describe('typed', () => {
    interface ILeg {
      length: string;
    }
    interface IRaccoon {
      legs: ILeg[];
    }
    interface IForest {
      raccoons: IRaccoon[];
    }

    const forest: IForest = {
      raccoons: [
        { legs: [{ length: 'short' }, { length: 'long' }] },
        { legs: [{ length: 'fat' }, { length: 'thick' }] },
      ],
    };

    const raccoons = Lens.key<IForest>()('raccoons');
    const legs = Lens.key<IRaccoon>()('legs');
    const length = Lens.key<ILeg>()('length');

    testLens(
      'case 1',
      raccoons.compose(Lens.index<IRaccoon>(0)).compose(legs).compose(Lens.index<ILeg>(0)).compose(length),
      forest,
      'short',
      'bold',
      'cursive'
    );

    testLens(
      'case 2',
      raccoons.compose(Lens.index<IRaccoon>(1)).compose(legs).compose(Lens.index<ILeg>(1)).compose(length),
      forest,
      'thick',
      'broken',
      'beautiful'
    );

    testLens(
      'compose',
      Lens.compose(raccoons, Lens.index(0), legs, Lens.index(1), length),
      forest,
      'long',
      'metal',
      'deus ex'
    );
  });

  describe('find', () => {
    const xs = [1, 2, 3, 4, 5];
    const l = Lens.find((x: number) => x === 3);

    const oldVal = 3;
    const newVal = 5;

    it('get', () => expect(l.get(xs)).toEqual(oldVal));
    it('set', () => expect(l.get(l.set(newVal, xs))).toEqual(undefined));
  });

  describe('withDefault', () => {
    const s = { a: 5, b: 6 }; // c is undefined
    const l1 = Lens.key<number>('a').compose(Lens.withDefault(777));
    const l2 = Lens.key<number>('c').compose(Lens.withDefault(777));

    it('should get defined value', () => expect(l1.get(s)).toEqual(5));
    it('should reset defined value', () => expect(l1.set(6, s)).toEqual({ a: 6, b: 6 }));
    it('should get default value instead of undefined', () => expect(l2.get(s)).toEqual(777));
    it('should reset undefined value other then default', () =>
      expect(l2.set(6, s)).toEqual({ a: 5, b: 6, c: 6 }));
    it('should reset undefined value on default', () =>
      expect(l2.set(777, s)).toEqual({ a: 5, b: 6, c: 777 }));
  });

  describe('withDefault transforms Prism into Lens', () => {
    const s = { a: 5, b: 6 }; // c is undefined
    const l1 = Lens.key<number>('a').compose(Lens.withDefault(777));
    const l2 = Lens.key<number>('c').compose(Lens.withDefault(777));

    // the lines below should compile
    let _: number = l1.get(s);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ = l2.get(s);
  });

  describe('type safe key', () => {
    const s = { a: 5, b: '6' };

    testLens<typeof s, typeof s['a']>('type safe key 1', Lens.key<typeof s>()('a'), s, 5, 6, 7);

    testLens<typeof s, typeof s['b']>('type safe key 2', Lens.key<typeof s>()('b'), s, '6', '7', 'hello');
  });
});
