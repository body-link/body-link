import { BehaviorSubject, of } from 'rxjs';
import { Atom } from './Atom';
import * as tg from './guards';

const alwaysFalsy = [
  null,
  undefined,
  '',
  1,
  true,
  NaN,
  new Set(),
  new Map(),
  () => null,
  of(1),
  new BehaviorSubject(1),
];

const atom$ = Atom.create({ a: 1 });
const readOnlyAtom$ = atom$.view('a');

const stage: { fn: (v: unknown) => boolean; truthy: unknown[]; falsy: unknown[] }[] = [
  {
    fn: tg.isAtom,
    truthy: [atom$],
    falsy: [...alwaysFalsy, readOnlyAtom$],
  },
  {
    fn: tg.isReadOnlyAtom,
    truthy: [readOnlyAtom$],
    falsy: [...alwaysFalsy, atom$],
  },
  {
    fn: tg.isAnyAtom,
    truthy: [readOnlyAtom$, atom$],
    falsy: alwaysFalsy,
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
