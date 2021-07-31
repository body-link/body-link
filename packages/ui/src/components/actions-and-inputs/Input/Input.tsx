import React from 'react';
import { isDefined, isText, TIdentifier } from '@body-link/type-guards';
import { IFlexItem, ISizingWidth, useTheme } from '../../../theme';
import { InputContainer } from '../InputContainer/InputContainer';
import { Spinner } from '../../status-and-feedback/Spinner/Spinner';
import { IconClear } from '../../icons/IconClear';
import { InputContainerItem } from '../InputContainer/InputContainerItem';
import { InputContainerButtonIcon } from '../InputContainer/InputContainerButtonIcon';
import { InputContainerInput } from '../InputContainer/InputContainerInput';
import { IconError } from '../../icons/IconError';

type TInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface IPropsInput
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    ISizingWidth,
    IFlexItem {
  value: TIdentifier;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  inputProps?: TInputProps;
  rightSide?: React.ReactNode;
  error?: string;
  hasClearButton?: boolean;
  onClearButtonClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  ref?: React.Ref<HTMLDivElement>;
}

export const Input: React.FC<IPropsInput> = React.memo<IPropsInput>(
  React.forwardRef<HTMLDivElement, IPropsInput>(
    (
      {
        value,
        onChange,
        isInvalid = false,
        isDisabled = false,
        isReadOnly = false,
        isLoading = false,
        placeholder,
        inputProps = {} as TInputProps,
        rightSide,
        error,
        hasClearButton = false,
        onClearButtonClick,
        ...rest
      },
      ref
    ) => {
      const theme = useTheme();
      const inputOnChange = inputProps.onChange;
      const innerOnClearButtonClick = React.useCallback<
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
      >(
        (e) => {
          onChange('');
          if (isDefined(onClearButtonClick)) {
            onClearButtonClick(e);
          }
        },
        [onClearButtonClick, onChange]
      );
      const innerOnChange = React.useCallback<(e: React.ChangeEvent<HTMLInputElement>) => void>(
        (e) => {
          onChange(e.target.value);
          if (isDefined(inputOnChange)) {
            inputOnChange(e);
          }
        },
        [onChange, inputOnChange]
      );
      return (
        <InputContainer {...rest} ref={ref} isInvalid={isInvalid} isReadOnly={isReadOnly}>
          <InputContainerInput
            {...inputProps}
            value={value}
            onChange={innerOnChange}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            placeholder={placeholder}
          />
          {isText(error) && (
            <InputContainerItem title={error}>
              <IconError
                color={isDisabled ? theme.colors.interactive.errorMute : theme.colors.interactive.error}
              />
            </InputContainerItem>
          )}
          {hasClearButton && isText(value) && (
            <InputContainerButtonIcon onClick={innerOnClearButtonClick} isDisabled={isDisabled}>
              <IconClear />
            </InputContainerButtonIcon>
          )}
          {isLoading && (
            <InputContainerItem>
              <Spinner />
            </InputContainerItem>
          )}
          {rightSide}
        </InputContainer>
      );
    }
  )
);
