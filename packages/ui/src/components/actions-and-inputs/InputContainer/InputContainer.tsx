import React from 'react';
import { cx } from '@emotion/css';
import { Box, IPropsBox } from '../../layout/Box/Box';
import { makeStyles } from '../../../theme';

interface IProps {
  isInvalid: boolean;
  isReadOnly: boolean;
}

export interface IPropsInputContainer extends IPropsBox, IProps {}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles<IProps>((theme, { isInvalid, isReadOnly }) => {
  return {
    root: {
      'position': 'relative',
      'overflow': 'hidden',
      'display': 'flex',
      'minHeight': theme.spaceToCSSValue(4),
      'boxShadow': `inset 0 0 0 ${theme.px(isReadOnly || isInvalid ? 2 : 1)} ${
        isInvalid ? theme.colors.interactive.error : theme.colors.interactive.base
      }`,
      'backgroundColor': theme.colors.interactive.bg,
      '&:focus-within': !isReadOnly && {
        boxShadow: `inset 0 0 0 2px ${theme.colors.interactive.invite}`,
      },
    },
  };
});

// eslint-disable-next-line @rushstack/typedef-var
export const InputContainer = React.forwardRef<HTMLDivElement, IPropsInputContainer>(
  ({ isInvalid, isReadOnly, className, ...rest }, ref) => {
    return <Box {...rest} ref={ref} className={cx(useStyles({ isInvalid, isReadOnly }).root, className)} />;
  }
);
