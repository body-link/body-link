import React from 'react';
import { cx } from '@emotion/css';
import { makeStyles } from '../../../theme';

export interface IPropsButtonTransparent extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isFit?: boolean;
  isDisabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles<'root' | 'fit'>((theme) => {
  return {
    root: {
      'all': 'initial',
      ...theme.fonts.BodyLine,
      'width': '100%',
      'minWidth': theme.spaceToCSSValue(3),
      'position': 'relative',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'boxSizing': 'border-box',
      'border': 0,
      'outline': 0,
      'backgroundColor': 'transparent',
      'color': theme.colors.interactive.text,
      'whiteSpace': 'nowrap',
      'overflow': 'hidden',
      'userSelect': 'none',
      'cursor': 'pointer',
      '&:disabled': {
        color: theme.colors.interactive.textMute,
        cursor: 'not-allowed',
      },
    },
    fit: {
      flex: '0 0 auto',
      width: 'auto',
    },
  };
});

export const ButtonTransparent: React.FC<IPropsButtonTransparent> = React.forwardRef<
  HTMLButtonElement,
  IPropsButtonTransparent
>(({ isDisabled = false, isFit = false, className, ...rest }, ref) => {
  const classes = useStyles();
  return (
    <button
      type="button"
      {...rest}
      ref={ref}
      disabled={isDisabled}
      className={cx(classes.root, isFit && classes.fit, className)}
    />
  );
});
