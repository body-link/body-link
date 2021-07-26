import React from 'react';
import { cx } from '@emotion/css';
import { makeStyles } from '../../../theme';

interface IPropsStyle {
  size?: number;
}

export interface IPropsOverlayArrow extends React.HTMLAttributes<HTMLDivElement>, IPropsStyle {}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles<IPropsStyle>((theme, { size = theme.gridCoefficientToNumber(2) }) => {
  const comp = (size / 2) * -1;
  return {
    root: {
      'position': 'relative',
      'width': size,
      'height': size,
      'pointerEvents': 'none',
      'backgroundColor': theme.colors.container.border,
      '&::before': {
        width: size,
        height: size,
        position: 'absolute',
        content: '""',
        backgroundColor: theme.colors.container.bg,
      },
      "[data-popper-placement^='top'] > &": {
        'bottom': comp,
        'clipPath': 'polygon(100% 50%, 0% 50%, 50% 100%)',
        '&::before': {
          clipPath: 'polygon(90% 50%, 10% 50%, 50% 90%)',
        },
      },
      "[data-popper-placement^='bottom'] > &": {
        'top': comp,
        'clipPath': 'polygon(100% 50%, 0% 50%, 50% 0%)',
        '&::before': {
          clipPath: 'polygon(90% 50%, 10% 50%, 50% 10%)',
        },
      },
      "[data-popper-placement^='left'] > &": {
        'right': comp,
        'clipPath': 'polygon(100% 50%, 50% 0%, 50% 100%)',
        '&::before': {
          clipPath: 'polygon(90% 50%, 50% 10%, 50% 90%)',
        },
      },
      "[data-popper-placement^='right'] > &": {
        'left': comp,
        'clipPath': 'polygon(50% 0%, 50% 100%, 0% 50%)',
        '&::before': {
          clipPath: 'polygon(50% 90%, 10% 50%, 50% 10%)',
        },
      },
    },
  };
});

// eslint-disable-next-line @rushstack/typedef-var
export const OverlayArrow = React.forwardRef<HTMLDivElement, IPropsOverlayArrow>(
  ({ size, className, ...rest }, ref) => {
    return <div {...rest} ref={ref} className={cx(useStyles({ size }).root, className)} />;
  }
);
