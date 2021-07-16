import { combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { isDefined, TUnboxArray } from '@body-link/type-guards';
import { Atom, ReadOnlyAtom } from '../../packlets/atom';
import { IAtomFieldArray, IAtomFieldArrayParameters, IAtomFieldArrayState, TAtomFieldAny } from './types';

export class AtomFieldArray<T extends TAtomFieldAny[]> implements IAtomFieldArray<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public children$: Atom<T> = Atom.create<T>([] as any);
  public max: number = Infinity;
  public min: number = 0;

  private $: Atom<IAtomFieldArrayState<T>> = Atom.create<IAtomFieldArrayState<T>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resultValue: [] as any,
    isTouched: false,
    isUntouched: true,
    isPristine: true,
    isDirty: false,
    isValid: true,
    isInvalid: false,
    error: '',
  });

  public state$: ReadOnlyAtom<IAtomFieldArrayState<T>> = this.$.view();

  public constructor({ children, max, min }: IAtomFieldArrayParameters<T>) {
    if (isDefined(children)) {
      this.children$.set([...children] as T);
    }
    if (isDefined(max)) {
      this.max = max;
    }
    if (isDefined(min)) {
      this.min = min;
    }

    this.children$
      .pipe(switchMap((v) => (v.length > 0 ? combineLatest(v.map((field) => field.state$)) : of([]))))
      .subscribe((fieldStates) => {
        const length = fieldStates.length;
        let error = '';
        let isValid = true;
        if (length < this.min) {
          isValid = false;
          error = `Add ${this.min - length} more items`;
        } else if (length > this.max) {
          isValid = false;
          error = `Remove ${length - this.max} items`;
        }

        const state = fieldStates.reduce(
          (acc, fieldState, index) => {
            acc.resultValue[index] = fieldState.resultValue;
            if (fieldState.isTouched && acc.isUntouched) {
              acc.isTouched = true;
              acc.isUntouched = false;
            }
            if (fieldState.isDirty && acc.isPristine) {
              acc.isPristine = false;
              acc.isDirty = true;
            }
            if (fieldState.isInvalid && acc.isValid) {
              acc.isValid = false;
              acc.isInvalid = true;
              acc.error = fieldState.error;
            }
            return acc;
          },
          {
            ...this.$.get(),
            resultValue: [],
            isValid,
            isInvalid: !isValid,
            error,
          }
        );

        this.$.set(state as IAtomFieldArrayState<T>);
      });
  }

  public reset = (): void => {
    const children = this.children$.get();
    children.forEach((field) => {
      field.reset();
    });
  };

  public add = (field: TUnboxArray<T>): void => {
    const children = this.children$.get();
    this.children$.set([...children, field] as T);
  };

  public remove = (index: number): void => {
    const children = this.children$.get();
    if (isDefined(children[index])) {
      const next = (
        children.length > 1 ? [...children.slice(0, index), ...children.slice(index + 1)] : []
      ) as T;
      this.children$.set(next);
    }
  };
}
