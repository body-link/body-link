import React from 'react';
import { cx } from '@emotion/css';
import { Box, IPropsBox } from '../../layout/Box/Box';
import { EThemeFont, makeStyles } from '../../../theme';

interface IProps {
  variant: EThemeFont;
  color?: string;
}

export interface IPropsText extends IPropsBox, IProps {}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles<IProps>((theme, { variant, color = 'inherit' }) => {
  return {
    root: {
      ...theme.fonts[variant],
      color,
    },
  };
});

// eslint-disable-next-line @rushstack/typedef-var
export const Text = React.forwardRef<HTMLDivElement, IPropsText>(
  ({ variant, color, className, ...rest }, ref) => {
    return <Box {...rest} ref={ref} className={cx(useStyles({ variant, color }).root, className)} />;
  }
);
