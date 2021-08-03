import { isDefined, isUndefined } from '@body-link/type-guards';
import { structEq } from '../../packlets/lens';
import { Atom, ReadOnlyAtom } from '../../packlets/atom';
import { IAtomField, IAtomFieldParameters, IAtomFieldState } from './types';

export class AtomField<T> implements IAtomField<T> {
  public state$: ReadOnlyAtom<IAtomFieldState<T>>;

  private _isTouched: boolean = false;
  private readonly _parameters: IAtomFieldParameters<T>;
  private readonly _state$: Atom<IAtomFieldState<T>>;

  public constructor(parameters: IAtomFieldParameters<T>) {
    this._parameters = parameters;
    this._state$ = Atom.create(this._createState(parameters.initialValue));
    this.state$ = this._state$.view();
  }

  public change = (currentVal: T): void => {
    this._state$.set(this._createState(currentVal));
  };

  public reset = (): void => {
    const parameters = this._parameters;
    this.change('resetValue' in parameters ? parameters.resetValue! : parameters.initialValue);
  };

  public touch = (): void => {
    if (!this._isTouched) {
      this._isTouched = true;
      this._state$.modify((s) => ({ ...s, isTouched: true, isUntouched: false }));
    }
  };

  public untouch = (): void => {
    if (this._isTouched) {
      this._isTouched = false;
      this._state$.modify((s) => ({ ...s, isTouched: false, isUntouched: true }));
    }
  };

  private _createState(currentVal: T): IAtomFieldState<T> {
    const {
      _isTouched: isTouched,
      _parameters: { initialValue, sanitize, validate },
    } = this;
    const resultValue = isDefined(sanitize) ? sanitize(currentVal) : currentVal;
    const isPristine = this._compare(initialValue, currentVal);
    const potentialError = isDefined(validate) ? validate(resultValue) : undefined;
    const isValid = isUndefined(potentialError);
    const error = isValid ? '' : (potentialError as string);
    return {
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
    };
  }

  private _compare(initialValue: T, resultValue: T): boolean {
    if (isDefined(this._parameters.compare)) {
      return this._parameters.compare(initialValue, resultValue);
    } else {
      return structEq(initialValue, resultValue);
    }
  }
}
