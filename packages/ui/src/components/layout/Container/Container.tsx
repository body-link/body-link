import React from 'react';
import { cx } from '@emotion/css';
import { IPropsStack, Stack } from '../Stack/Stack';
import { makeStyles } from '../../../theme';

// eslint-disable-next-line @rushstack/typedef-var
const propClassNames = [
  'hasBorder',
  'hasBorderTop',
  'hasBorderBottom',
  'hasBorderLeft',
  'hasBorderRight',
  'isSolid',
  'isDimmed',
  'isHighlighted',
  'isHoverable',
  'isElevated',
] as const;

type TPropClassName = typeof propClassNames[number];

export interface IPropsContainer extends IPropsStack, Partial<Record<TPropClassName, boolean>> {}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles<TPropClassName>((theme) => {
  return {
    hasBorder: {
      border: `1px solid ${theme.colors.container.base}`,
    },
    hasBorderTop: {
      borderTop: `1px solid ${theme.colors.container.base}`,
    },
    hasBorderBottom: {
      borderBottom: `1px solid ${theme.colors.container.base}`,
    },
    hasBorderLeft: {
      borderLeft: `1px solid ${theme.colors.container.base}`,
    },
    hasBorderRight: {
      borderRight: `1px solid ${theme.colors.container.base}`,
    },
    isSolid: {
      backgroundColor: theme.colors.container.solid,
      color: theme.colors.container.solidText,
    },
    isDimmed: {
      backgroundColor: theme.colors.container.dimmed,
      color: theme.colors.container.dimmedText,
    },
    isHighlighted: {
      backgroundColor: theme.colors.container.highlighted,
      color: theme.colors.container.highlightedText,
    },
    isHoverable: {
      '&:hover': {
        backgroundColor: theme.colors.container.hoverable,
        color: theme.colors.container.hoverableText,
      },
    },
    isElevated: {
      boxShadow: theme.shadows.overlay,
    },
  };
});

// eslint-disable-next-line @rushstack/typedef-var
export const Container = React.forwardRef<HTMLDivElement, IPropsContainer>(({ className, ...rest }, ref) => {
  const classes = useStyles();
  const classNames = propClassNames
    .filter((n) => {
      if (n in rest) {
        const v = rest[n];
        delete rest[n];
        return v;
      }
    })
    .map((n) => classes[n]);
  return <Stack {...rest} ref={ref} className={cx(classNames, className)} />;
});
