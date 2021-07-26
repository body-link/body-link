import React from 'react';
import { cx } from '@emotion/css';
import { makeStyles } from '../../../theme';
import { ButtonTransparent, IPropsButtonTransparent } from '../ButtonTransparent/ButtonTransparent';

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles((theme) => {
  return {
    root: {
      'flexShrink': 0,
      'width': theme.spaceToCSSValue(3),
      'paddingLeft': theme.spaceToCSSValue(0.5),
      'paddingRight': theme.spaceToCSSValue(0.5),
      'color': theme.colors.interactive.base,
      '&:disabled': {
        color: theme.colors.interactive.baseMute,
      },
      '&:last-child': {
        width: theme.spaceToCSSValue(4),
        paddingRight: theme.spaceToCSSValue(1),
      },
      '&:first-child': {
        width: theme.spaceToCSSValue(4),
        paddingLeft: theme.spaceToCSSValue(1),
      },
    },
  };
});

export const InputContainerButtonIcon: React.FC<IPropsButtonTransparent> = React.forwardRef<
  HTMLButtonElement,
  IPropsButtonTransparent
>(({ className, isDisabled = false, ...rest }, ref) => {
  return (
    <ButtonTransparent
      {...rest}
      ref={ref}
      className={cx(useStyles().root, className)}
      isDisabled={isDisabled}
    />
  );
});
