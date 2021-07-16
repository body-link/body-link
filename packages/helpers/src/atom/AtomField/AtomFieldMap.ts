import { combineLatest } from 'rxjs';
import { Atom, ReadOnlyAtom } from '../../packlets/atom';
import {
  IAtomFieldMapParameters,
  IAtomFieldMap,
  IAtomFieldMapState,
  TAtomFieldAny,
  TAtomFieldStateAny,
} from './types';

export class AtomFieldMap<T extends Record<string, TAtomFieldAny>> implements IAtomFieldMap<T> {
  private _parameters: IAtomFieldMapParameters<T>;
  private $: Atom<IAtomFieldMapState<T>> = Atom.create<IAtomFieldMapState<T>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resultValue: {} as any,
    isTouched: false,
    isUntouched: true,
    isPristine: true,
    isDirty: false,
    isValid: true,
    isInvalid: false,
    error: '',
  });

  public state$: ReadOnlyAtom<IAtomFieldMapState<T>> = this.$.view();
  public children: T;

  public constructor(parameters: IAtomFieldMapParameters<T>) {
    this._parameters = parameters;
    this.children = parameters.children;
    combineLatest(
      Object.entries(this._parameters.children).map(([id, field]) =>
        (field.state$ as ReadOnlyAtom<TAtomFieldStateAny>).view(
          (fieldState) => [id, fieldState] as [keyof T, TAtomFieldStateAny]
        )
      )
    ).subscribe((fieldStates) => {
      const state = fieldStates.reduce(
        (acc, [id, fieldState]) => {
          acc.resultValue[id] = fieldState.resultValue;
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
          resultValue: {},
          isTouched: false,
          isUntouched: true,
          isPristine: true,
          isDirty: false,
          isValid: true,
          isInvalid: false,
          error: '',
        } as IAtomFieldMapState<T>
      );

      this.$.set(state);
    });
  }

  public reset = (): void => {
    Object.values(this._parameters.children).forEach((field) => {
      field.reset();
    });
  };
}
