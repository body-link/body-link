import React from 'react';
import { cx } from '@emotion/css';
import {
  $borderBox,
  $initial,
  IFlexItem,
  ISizing,
  makeStyles,
  useStylesFlexItem,
  useStylesSizing,
} from '../../../theme';

export interface IPropsButtonTransparent
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ISizing,
    IFlexItem {
  isFit?: boolean;
  isDisabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles<'root' | 'fit'>((theme) => {
  return {
    root: {
      ...theme.fonts.BodyLine,
      'width': '100%',
      'minWidth': theme.spaceToCSSValue(3),
      'position': 'relative',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
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
>(
  (
    { isDisabled = false, isFit = false, w, wMin, wMax, h, hMin, hMax, flex, alignSelf, className, ...rest },
    ref
  ) => {
    const classes = useStyles();
    const { root: $sizing } = useStylesSizing({ w, wMin, wMax, h, hMin, hMax });
    const { root: $flexItem } = useStylesFlexItem({ flex, alignSelf });
    return (
      <button
        type="button"
        {...rest}
        ref={ref}
        disabled={isDisabled}
        className={cx(
          $initial,
          $borderBox,
          classes.root,
          $sizing,
          $flexItem,
          isFit && classes.fit,
          className
        )}
      />
    );
  }
);
