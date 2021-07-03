import React from 'react';
import { cx, keyframes } from '@emotion/css';
import { makeStyles } from '../../../theme';

interface IStyleProps {
  color?: string;
  size?: number;
}

export interface IPropsSpinner extends React.HTMLAttributes<HTMLDivElement>, IStyleProps {}

const flip: string = keyframes({
  '0%': {
    animationTimingFunction: 'cubic-bezier(0.1909,0.4373,0.4509,0.7454)',
    transform: 'rotateY(0)',
  },
  '30%': {
    animationTimingFunction: 'cubic-bezier(0.128,0.2315,0.9704,0.8632)',
    transform: 'rotateY(153.72deg)',
  },
  '50%': {
    animationTimingFunction: 'cubic-bezier(0.5788,0.3001,0.5613,0.6784)',
    transform: 'rotateY(180deg)',
  },
  '55%': {
    animationTimingFunction: 'cubic-bezier(0.1545,0.4929,0.6089,0.9373)',
    transform: 'rotateY(238.68deg)',
  },
  '100%': {
    transform: 'rotateY(360deg)',
  },
});

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles<IStyleProps>((theme, { color, size }) => {
  const pxSize = theme.spaceToCSSValue(size ?? 3);
  return {
    root: {
      width: pxSize,
      height: pxSize,
      backgroundColor: color ?? theme.defaultColorSet.counter,
      borderRadius: '50%',
      animation: `${flip} 1s infinite linear`,
    },
  };
});

// eslint-disable-next-line @rushstack/typedef-var
export const Spinner = React.forwardRef<HTMLDivElement, IPropsSpinner>(
  ({ color, size, className, ...rest }, ref) => {
    return <div {...rest} ref={ref} className={cx(useStyles({ color, size }).root, className)} />;
  }
);
