import React from 'react';
import { CSSObject, cx } from '@emotion/css';
import { isDefined } from '@body-link/type-guards';
import { important, makeStyles, TSpace } from '../../../theme';
import { Box, IPropsBox } from '../Box/Box';

interface IStyleProps {
  isInline?: boolean;
  isCentered?: boolean;
  isMiddled?: boolean;
  spacing?: TSpace;
}

export interface IPropsStack extends IPropsBox, IStyleProps {}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles<IStyleProps>(
  (theme, { spacing, isInline = false, isCentered = false, isMiddled = false }) => {
    const root: CSSObject = {
      display: 'flex',
      flexDirection: isInline ? 'row' : 'column',
    };
    if (isDefined(spacing)) {
      const primary = important(theme.spaceToCSSValue(spacing));
      const secondary = important(0);
      if (isInline) {
        Object.assign(root, {
          '&>*': {
            marginRight: primary,
          },
          '&>*:last-child': {
            marginRight: secondary,
          },
        });
      } else {
        Object.assign(root, {
          '&>*': {
            marginBottom: primary,
          },
          '&>*:last-child': {
            marginBottom: secondary,
          },
        });
      }
    }
    if (isMiddled || isCentered) {
      root.alignItems = 'center';
    }
    if (isMiddled) {
      root.justifyContent = 'center';
    }
    return {
      root,
    };
  }
);

// eslint-disable-next-line @rushstack/typedef-var
export const Stack = React.forwardRef<HTMLDivElement, IPropsStack>(
  ({ isInline, isCentered, isMiddled, spacing, className, ...rest }, ref) => {
    return (
      <Box
        {...rest}
        ref={ref}
        className={cx(useStyles({ isInline, isCentered, isMiddled, spacing }).root, className)}
      />
    );
  }
);
