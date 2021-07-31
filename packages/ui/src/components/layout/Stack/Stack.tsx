import React from 'react';
import { CSSObject, cx } from '@emotion/css';
import { isDefined } from '@body-link/type-guards';
import { important, makeStyles, TSpace } from '../../../theme';
import { Box, IPropsBox } from '../Box/Box';

interface IStyleProps {
  spacing?: TSpace;
  isInline?: boolean;
  isCentered?: boolean;
  alignItems?: CSSObject['alignItems'];
  justifyContent?: CSSObject['justifyContent'];
}

export interface IPropsStack extends IPropsBox, IStyleProps {}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles<IStyleProps>(
  (theme, { spacing, isInline = false, isCentered = false, alignItems, justifyContent }) => {
    const root: CSSObject = {
      display: 'flex',
      flexDirection: isInline ? 'row' : 'column',
      alignItems,
      justifyContent,
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
    if (isCentered) {
      root.alignItems = 'center';
      root.justifyContent = 'center';
    }
    return {
      root,
    };
  }
);

// eslint-disable-next-line @rushstack/typedef-var
export const Stack = React.forwardRef<HTMLDivElement, IPropsStack>(
  ({ spacing, isInline, isCentered, alignItems, justifyContent, className, ...rest }, ref) => {
    return (
      <Box
        {...rest}
        ref={ref}
        className={cx(
          useStyles({ spacing, isInline, isCentered, alignItems, justifyContent }).root,
          className
        )}
      />
    );
  }
);
