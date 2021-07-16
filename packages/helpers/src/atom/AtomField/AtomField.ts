import { isDefined, isUndefined } from '@body-link/type-guards';
import { structEq } from '../../packlets/lens';
import { Atom, ReadOnlyAtom } from '../../packlets/atom';
import { IAtomField, IAtomFieldParameters, IAtomFieldState } from './types';

export class AtomField<T> implements IAtomField<T> {
  public state$: ReadOnlyAtom<IAtomFieldState<T>>;

  private $: Atom<IAtomFieldState<T>>;
  private readonly _parameters: IAtomFieldParameters<T>;

  public constructor(parameters: IAtomFieldParameters<T>) {
    this._parameters = parameters;
    const { initialValue, sanitize, validate } = parameters;
    const resultValue = isDefined(sanitize) ? sanitize(initialValue) : initialValue;
    const potentialError = isDefined(validate) ? validate(resultValue) : undefined;
    const isValid = isUndefined(potentialError);
    const error = isValid ? '' : (potentialError as string);
    const initialState = {
      initialValue,
      currentVal: initialValue,
      resultValue,
      isTouched: false,
      isUntouched: true,
      isPristine: true,
      isDirty: false,
      isValid,
      isInvalid: !isValid,
      error,
    };
    this.$ = Atom.create(initialState);
    this.state$ = this.$.view();
  }

  public change = (currentVal: T): void => {
    const { sanitize, validate } = this._parameters;
    const { initialValue, isTouched } = this.$.get();
    const resultValue = isDefined(sanitize) ? sanitize(currentVal) : currentVal;
    const isPristine = this._compare(initialValue, currentVal);
    const potentialError = isDefined(validate) ? validate(resultValue) : undefined;
    const isValid = isUndefined(potentialError);
    const error = isValid ? '' : (potentialError as string);
    this.$.set({
      initialValue,
      currentVal,
      resultValue,
      isTouched,
      isUntouched: !isTouched,
      isPristine,
      isDirty: !isPristine,
      isValid,
      isInvalid: !isValid,
      error,
    });
  };

  public reset = (): void => {
    const params = this._parameters;
    this.change('resetValue' in params ? (params.resetValue as T) : params.initialValue);
  };

  public touch = (): void => {
    this.$.modify((s) => ({ ...s, isTouched: true, isUntouched: false }));
  };

  public untouch = (): void => {
    this.$.modify((s) => ({ ...s, isTouched: false, isUntouched: true }));
  };

  private _compare(initialValue: T, resultValue: T): boolean {
    if (isDefined(this._parameters.compare)) {
      return this._parameters.compare(initialValue, resultValue);
    } else {
      return structEq(initialValue, resultValue);
    }
  }
}
