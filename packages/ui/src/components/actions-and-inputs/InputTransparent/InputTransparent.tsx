import React from 'react';
import { CSSObject, cx } from '@emotion/css';
import { TAnyObject } from '@body-link/type-guards';
import { mergeFunctionsInObjects } from '@body-link/helpers';
import { $borderBox, $initial, makeStyles } from '../../../theme';

export interface IPropsInputTransparent extends React.InputHTMLAttributes<HTMLInputElement> {
  isDisabled?: boolean;
  isReadOnly?: boolean;
  selectOnFocus?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles((theme) => {
  const style: CSSObject = {
    ...theme.fonts.BodyLine,
    'width': '100%',
    'minWidth': theme.spaceToCSSValue(3),
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
>(({ isDisabled = false, isReadOnly = false, selectOnFocus = false, className, ...rest }, ref) => {
  if (selectOnFocus) {
    Object.assign(
      rest,
      mergeFunctionsInObjects(rest as TAnyObject, {
        onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.target.select(),
      })
    );
  }
  return (
    <input
      type="text"
      disabled={isDisabled}
      readOnly={isReadOnly}
      {...rest}
      ref={ref}
      className={cx($initial, $borderBox, useStyles().root, className)}
    />
  );
});
