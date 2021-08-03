import React from 'react';
import Big from 'big.js';
import { isDefined, isNotNull, isText, TOption } from '@body-link/type-guards';
import { AtomField, useObservable, useForkRef } from '@body-link/helpers';
import { Input, IPropsInput } from '../../actions-and-inputs/Input/Input';
import { IInputEvents, useInputEvents } from '../../utils/useInputEvents/useInputEvents';

interface IProps extends Omit<IPropsInput, 'value' | 'onChange' | 'isInvalid'> {}

export interface IPropsAFInputNumber extends IProps {
  field: AtomField<number>;
  isOptional?: false;
}

export interface IPropsAFInputNumberOptional extends IProps {
  field: AtomField<TOption<number>>;
  isOptional: true;
}

const REGEX_NUMBER: RegExp = /-?\d+\.?\d*/;

const textToNumber = (text: string): TOption<number> => {
  const sanitized = text.trim();
  if (isText(sanitized)) {
    const e = REGEX_NUMBER.exec(sanitized);
    if (isNotNull(e)) {
      return parseFloat(e[0]);
    }
  }
};

function Component(props: IPropsAFInputNumber): JSX.Element;
function Component(props: IPropsAFInputNumberOptional): JSX.Element;
function Component({
  field,
  isOptional = false,
  inputProps,
  ...rest
}: IPropsAFInputNumber | IPropsAFInputNumberOptional): JSX.Element {
  const { resultValue, isTouched, isValid, error } = useObservable(field.state$);
  const isInvalid = isTouched && !isValid;

  const textFromField = String(resultValue ?? '');

  const [text, setText] = React.useState(textFromField);
  const [isEditing, setIsEditing] = React.useState(false);

  const { events, onChange } = React.useMemo<{
    events: IInputEvents;
    onChange: (nextText: string) => void;
  }>(() => {
    return {
      onChange: (nextText: string): void => {
        setText(nextText);
        const fieldVal = textToNumber(nextText);
        if (isDefined(fieldVal)) {
          field.change(fieldVal);
        } else {
          if (isOptional) {
            (field as AtomField<TOption<number>>).change(fieldVal);
          } else {
            field.reset();
          }
        }
      },
      events: {
        onBlur: () => {
          field.touch();
          setIsEditing(false);
          setText(String(field.state$.get().resultValue ?? ''));
        },
        onFocus: (el) => {
          setIsEditing(true);
          el.select();
        },
        onZoom: (el, e) => {
          const prevValue = field.state$.get().resultValue ?? 0;
          const multiplier = e.ctrlKey ? 100 : e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
          const inc = (e.up ? 1 : -1) * multiplier;
          const nextValue = Big(prevValue).plus(inc);
          setText(nextValue.toString());
          field.change(nextValue.toNumber());
          el.select();
        },
      },
    };
  }, [field, isOptional]);

  const ie = useInputEvents(events);

  const ref = useForkRef(ie.ref, inputProps?.ref);

  const innerInputProps = React.useMemo(() => ({ ...inputProps, ref }), [inputProps, ref]);

  return (
    <Input
      value={isEditing ? text : textFromField}
      error={error}
      onChange={onChange}
      inputProps={innerInputProps}
      isInvalid={isInvalid}
      hasClearButton={isOptional}
      {...rest}
    />
  );
}

export const AFInputNumber: typeof Component = React.memo(Component) as unknown as typeof Component;
