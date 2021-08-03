import React from 'react';
import { isDefined, isText, TOption } from '@body-link/type-guards';
import { AtomField, mergeFunctionsInObjects, useObservable } from '@body-link/helpers';
import { Input, IPropsInput } from '../../actions-and-inputs/Input/Input';

interface IProps extends Omit<IPropsInput, 'value' | 'onChange' | 'isInvalid'> {}

export interface IPropsAFInputString extends IProps {
  field: AtomField<string>;
  isOptional?: false;
}

export interface IPropsAFInputStringOptional extends IProps {
  field: AtomField<TOption<string>>;
  isOptional: true;
}

function Component(props: IPropsAFInputString): JSX.Element;
function Component(props: IPropsAFInputStringOptional): JSX.Element;
function Component({
  field,
  isOptional = false,
  inputProps,
  ...rest
}: IPropsAFInputString | IPropsAFInputStringOptional): JSX.Element {
  const state = useObservable(field.state$);
  const currentVal = state.currentVal;
  const isInvalid = state.isTouched && state.isInvalid;
  const [value, setValue] = React.useState(currentVal);
  const prevValue = React.useRef(value);
  const onChange = React.useCallback(
    (val: string) => {
      setValue(val);
      const sanitized = val.trim();
      const fieldVal = isText(sanitized) ? sanitized : undefined;
      prevValue.current = fieldVal;
      if (isDefined(fieldVal)) {
        field.change(fieldVal);
      } else {
        if (isOptional) {
          (field as AtomField<TOption<string>>).change(undefined);
        } else {
          field.change('');
        }
      }
    },
    [field, isOptional]
  );
  // Field values sync
  React.useEffect(() => {
    if (currentVal !== prevValue.current) {
      setValue(currentVal);
    }
  }, [currentVal]);
  return (
    <Input
      value={value ?? ''}
      onChange={onChange}
      inputProps={mergeFunctionsInObjects(inputProps, { onBlur: field.touch })}
      isInvalid={isInvalid}
      hasClearButton={isOptional}
      {...rest}
    />
  );
}

export const AFInputString: typeof Component = React.memo(Component) as unknown as typeof Component;
