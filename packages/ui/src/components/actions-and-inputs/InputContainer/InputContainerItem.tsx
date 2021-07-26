import React from 'react';
import { cx } from '@emotion/css';
import { makeStyles } from '../../../theme';

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles((theme) => {
  return {
    root: {
      'flexShrink': 0,
      'display': 'flex',
      'alignItems': 'center',
      'paddingLeft': theme.spaceToCSSValue(0.5),
      'paddingRight': theme.spaceToCSSValue(0.5),
      '&:last-child': {
        paddingRight: theme.spaceToCSSValue(1),
      },
      '&:first-child': {
        paddingLeft: theme.spaceToCSSValue(1),
      },
    },
  };
});

// eslint-disable-next-line @rushstack/typedef-var
export const InputContainerItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => {
    return <div {...rest} ref={ref} className={cx(useStyles().root, className)} />;
  }
);
