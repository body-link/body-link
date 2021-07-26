import React from 'react';
import { cx } from '@emotion/css';
import { makeStyles } from '../../../theme';

export interface IPropsButtonTransparent extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles((theme) => {
  return {
    root: {
      'all': 'initial',
      ...theme.fonts.BodyLine,
      'flexGrow': 1,
      'width': '100%',
      'minWidth': theme.spaceToCSSValue(3),
      'position': 'relative',
      'display': 'flex',
      'justifyContent': 'center',
      'alignItems': 'center',
      'boxSizing': 'border-box',
      'border': 0,
      'outline': 0,
      'backgroundColor': 'transparent',
      'color': theme.colors.interactive.text,
      'whiteSpace': 'nowrap',
      'userSelect': 'none',
      'cursor': 'pointer',
      '&:disabled': {
        color: theme.colors.interactive.textMute,
        cursor: 'not-allowed',
      },
    },
  };
});

export const ButtonTransparent: React.FC<IPropsButtonTransparent> = React.forwardRef<
  HTMLButtonElement,
  IPropsButtonTransparent
>(({ isDisabled = false, className, ...rest }, ref) => {
  return (
    <button
      type="button"
      {...rest}
      ref={ref}
      disabled={isDisabled}
      className={cx(useStyles().root, className)}
    />
  );
});
