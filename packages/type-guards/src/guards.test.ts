import * as tg from './index';

const stage: { fn: (v: unknown) => boolean; truthy: unknown[]; falsy: unknown[] }[] = [
  {
    fn: tg.isUndefined,
    truthy: [undefined],
    falsy: ['', null, 1, true, NaN],
  },
  {
    fn: tg.isDefined,
    truthy: ['', null, 1, true, NaN],
    falsy: [undefined],
  },
  {
    fn: tg.isNull,
    truthy: [null],
    falsy: ['', undefined, 1, true, NaN],
  },
  {
    fn: tg.isNotNull,
    truthy: ['', undefined, 1, true, NaN],
    falsy: [null],
  },
  {
    fn: tg.isPresent,
    truthy: ['', 1, true, NaN],
    falsy: [null, undefined],
  },
  {
    fn: tg.isError,
    truthy: [new Error()],
    falsy: [null, undefined, '', 1, true, NaN],
  },
  {
    fn: tg.isArray,
    truthy: [[1, 2, 3], []],
    falsy: [null, undefined, '', 1, true, NaN, new Set(), new Map(), () => null],
  },
  {
    fn: tg.isObject,
    truthy: [{ foo: 'bar' }, {}, new Set(), new Map()],
    falsy: [null, undefined, '', 1, true, NaN, () => null],
  },
  {
    fn: tg.isNumber,
    truthy: [-1, 0, 1, 999_999_999, 6.7],
    falsy: [null, undefined, '', true, NaN, new Set(), new Map(), () => null],
  },
  {
    fn: tg.isString,
    truthy: ['', 'str'],
    falsy: [null, undefined, 1, true, NaN, new Set(), new Map(), () => null],
  },
  {
    fn: tg.isText,
    truthy: ['str'],
    falsy: [null, undefined, '', 1, true, NaN, new Set(), new Map(), () => null],
  },
  {
    fn: tg.isFunction,
    truthy: [() => null, function () {}],
    falsy: [null, undefined, '', 1, true, NaN, new Set(), new Map()],
  },
];

stage.forEach((r) => {
  describe(r.fn.name, () => {
    r.truthy.forEach((value) => {
      it(`${value} should be true`, () => expect(r.fn(value)).toBeTruthy());
    });
    r.falsy.forEach((value) => {
      it(`${value} should be false`, () => expect(r.fn(value)).toBeFalsy());
    });
  });
});
