import React from 'react';
import { CSSObject, cx } from '@emotion/css';
import { makeStyles } from '../../../theme';
import { InputTransparent, IPropsInputTransparent } from '../InputTransparent/InputTransparent';

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles((theme) => {
  const style: CSSObject = {
    'paddingLeft': theme.spaceToCSSValue(0.5),
    'paddingRight': theme.spaceToCSSValue(0.5),
    '&:last-child': {
      paddingRight: theme.spaceToCSSValue(1),
    },
    '&:first-child': {
      paddingLeft: theme.spaceToCSSValue(1),
    },
  };
  return {
    root: {
      'input&': style,
      'input:not([readonly])&': style,
    },
  };
});

export const InputContainerInput: React.FC<IPropsInputTransparent> = React.forwardRef<
  HTMLInputElement,
  IPropsInputTransparent
>(({ className, ...rest }, ref) => {
  return <InputTransparent {...rest} ref={ref} className={cx(useStyles().root, className)} />;
});
