import React from 'react';
import { CSSObject, cx } from '@emotion/css';
import { makeStyles } from '../../../theme';

export interface IPropsInputTransparent extends React.InputHTMLAttributes<HTMLInputElement> {
  isDisabled?: boolean;
  isReadOnly?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles((theme) => {
  const style: CSSObject = {
    'all': 'initial',
    ...theme.fonts.BodyLine,
    'flexGrow': 1,
    'width': '100%',
    'minWidth': theme.spaceToCSSValue(3),
    'boxSizing': 'border-box',
    'border': 0,
    'outline': 0,
    'backgroundColor': 'transparent',
    'color': theme.colors.interactive.text,
    'textOverflow': 'ellipsis',
    '&:focus': {
      border: 0,
    },
    '&:disabled': {
      color: theme.colors.interactive.textMute,
      cursor: 'not-allowed',
    },
    '&[readonly]': {
      color: theme.colors.interactive.text,
      cursor: 'text',
    },
    '&::placeholder': {
      color: theme.colors.interactive.invite,
    },
  };
  return {
    // It's for avoiding 3rd parties specific CSS selectors
    root: {
      'input&': style,
      'input:not([readonly])&': style,
    },
  };
});

export const InputTransparent: React.FC<IPropsInputTransparent> = React.forwardRef<
  HTMLInputElement,
  IPropsInputTransparent
>(({ isDisabled = false, isReadOnly = false, className, ...rest }, ref) => {
  return (
    <input
      type="text"
      disabled={isDisabled}
      readOnly={isReadOnly}
      {...rest}
      ref={ref}
      className={cx(useStyles().root, className)}
    />
  );
});
