import React from 'react';
import { CSSObject, cx } from '@emotion/css';
import { IPropsStack, Stack } from '../Stack/Stack';
import { makeStyles } from '../../../theme';

export interface IPropsScroll extends IPropsStack {
  isHorizontal?: boolean;
  isVertical?: boolean;
}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles((theme) => {
  const size = theme.px(7);
  const color = theme.colors.container.base;
  const base: CSSObject = {
    '&::-webkit-scrollbar': {
      width: size,
      height: size,
    },
    '&::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: color,
    },
  };
  return {
    isHorizontal: {
      ...base,
      'overflowX': 'auto',
      'overflowY': 'hidden',
      '&::-webkit-scrollbar-track': {
        borderTop: `1px solid ${color}`,
      },
    },
    isVertical: {
      ...base,
      'overflowX': 'hidden',
      'overflowY': 'auto',
      '&::-webkit-scrollbar-track': {
        borderLeft: `1px solid ${color}`,
      },
    },
    both: {
      ...base,
      'overflow': 'auto',
      '&::-webkit-scrollbar-track': {
        borderTop: `1px solid ${color}`,
        borderLeft: `1px solid ${color}`,
      },
    },
    none: {
      overflow: 'hidden',
    },
  };
});

// eslint-disable-next-line @rushstack/typedef-var
export const Scroll = React.forwardRef<HTMLDivElement, IPropsScroll>(
  ({ isHorizontal = false, isVertical = false, className, ...rest }, ref) => {
    const classes = useStyles();
    return (
      <Stack
        {...rest}
        ref={ref}
        className={cx(
          {
            [classes.both]: isHorizontal && isVertical,
            [classes.none]: !isHorizontal && !isVertical,
            [classes.isHorizontal]: isHorizontal && !isVertical,
            [classes.isVertical]: !isHorizontal && isVertical,
          },
          className
        )}
      />
    );
  }
);
