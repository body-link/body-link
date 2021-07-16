import { TUnboxArray } from '@body-link/type-guards';
import { Atom, ReadOnlyAtom } from '../../packlets/atom';

export interface IAtomFieldParameters<T> {
  initialValue: T;
  resetValue?: T;
  validate?: (resultValue: T) => string | void; // Return not-empty string if error
  sanitize?: (currentVal: T) => T; // Return resultValue
  compare?: (initialValue: T, resultValue: T) => boolean; // To check pristine
}

export interface IAtomFieldMapParameters<T> {
  children: T;
}

export interface IAtomFieldArrayParameters<T> {
  children?: T;
  max?: number;
  min?: number;
}

export interface IAtomField<T> {
  state$: ReadOnlyAtom<IAtomFieldState<T>>;
  change: (currentVal: T) => void;
  reset: () => void;
  touch: () => void;
  untouch: () => void;
}

export interface IAtomFieldMap<T extends Record<string, TAtomFieldAny>> {
  state$: ReadOnlyAtom<IAtomFieldMapState<T>>;
  children: T;
  reset: () => void;
}

export interface IAtomFieldArray<T extends TAtomFieldAny[]> {
  state$: ReadOnlyAtom<IAtomFieldArrayState<T>>;
  children$: Atom<T>;
  max: number;
  min: number;
  reset: () => void;
  add: (field: TUnboxArray<T>) => void;
  remove: (index: number) => void;
}

interface IAtomFieldBase {
  isTouched: boolean;
  isUntouched: boolean;
  isPristine: boolean;
  isDirty: boolean;
  isValid: boolean;
  isInvalid: boolean;
  error: string;
}

export interface IAtomFieldState<T> extends IAtomFieldBase {
  initialValue: T;
  currentVal: T;
  resultValue: T;
}

export interface IAtomFieldMapState<T extends Record<string, TAtomFieldAny>> extends IAtomFieldBase {
  resultValue: {
    [K in keyof T]: T[K] extends IAtomField<infer AtomFieldT>
      ? AtomFieldT
      : T[K] extends IAtomFieldMap<infer AtomFieldMapT>
      ? IAtomFieldMapState<AtomFieldMapT>['resultValue']
      : T[K] extends IAtomFieldArray<infer AtomFieldArrayT>
      ? IAtomFieldArrayState<AtomFieldArrayT>['resultValue']
      : T[K];
  };
}

export interface IAtomFieldArrayState<T extends TAtomFieldAny[] | []> extends IAtomFieldBase {
  resultValue: {
    [K in keyof T]: T[K] extends IAtomField<infer AtomFieldT>
      ? AtomFieldT
      : T[K] extends IAtomFieldMap<infer AtomFieldMapT>
      ? IAtomFieldMapState<AtomFieldMapT>['resultValue']
      : T[K] extends IAtomFieldArray<infer AtomFieldArrayT>
      ? IAtomFieldArrayState<AtomFieldArrayT>['resultValue']
      : T[K];
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TAtomFieldAny = IAtomField<any> | IAtomFieldMap<any> | IAtomFieldArray<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TAtomFieldStateAny = IAtomFieldState<any> | IAtomFieldMapState<any> | IAtomFieldArrayState<any>;

export type TExtractAtomFieldType<T> = T extends IAtomField<infer X> ? X : never;
