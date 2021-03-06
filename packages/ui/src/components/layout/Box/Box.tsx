import React from 'react';
import { cx } from '@emotion/css';
import {
  $borderBox,
  $overflowHidden,
  IFlexItem,
  ISizing,
  ISpacing,
  useStylesFlexItem,
  useStylesSizing,
  useStylesSpacing,
} from '../../../theme';

export interface IPropsBox extends React.HTMLAttributes<HTMLDivElement>, ISpacing, ISizing, IFlexItem {
  overflowHidden?: boolean;
}

// eslint-disable-next-line @rushstack/typedef-var
export const Box = React.forwardRef<HTMLDivElement, IPropsBox>(
  (
    {
      w,
      wMin,
      wMax,
      h,
      hMin,
      hMax,
      p,
      pt,
      pb,
      pr,
      pl,
      m,
      mt,
      mb,
      mr,
      ml,
      flex,
      alignSelf,
      overflowHidden = false,
      className,
      ...rest
    },
    ref
  ) => {
    const { root: $sizing } = useStylesSizing({ w, wMin, wMax, h, hMin, hMax });
    const { root: $spacing } = useStylesSpacing({ p, pt, pb, pr, pl, m, mt, mb, mr, ml });
    const { root: $flexItem } = useStylesFlexItem({ flex, alignSelf });
    return (
      <div
        {...rest}
        ref={ref}
        className={cx($borderBox, overflowHidden && $overflowHidden, $sizing, $spacing, $flexItem, className)}
      />
    );
  }
);
