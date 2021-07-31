import React from 'react';
import { CSSObject, cx } from '@emotion/css';
import { optionalCall } from '@body-link/helpers';
import { makeStyles, TSpace, TSpaceValue } from '../../../theme';

interface IFlexItem {
  flex?: CSSObject['flex'];
  alignSelf?: CSSObject['alignSelf'];
}

interface ISpacing {
  p?: TSpaceValue;
  pt?: TSpace;
  pb?: TSpace;
  pr?: TSpace;
  pl?: TSpace;
  m?: TSpaceValue;
  mt?: TSpace;
  mb?: TSpace;
  mr?: TSpace;
  ml?: TSpace;
}

interface ISizing {
  w?: TSpace;
  wMin?: TSpace;
  wMax?: TSpace;
  h?: TSpace;
  hMin?: TSpace;
  hMax?: TSpace;
}

export interface IPropsBox extends React.HTMLAttributes<HTMLDivElement>, ISpacing, ISizing, IFlexItem {}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles<ISpacing & ISizing & IFlexItem>((theme, props) => {
  return {
    root: {
      flex: props.flex,
      alignSelf: props.alignSelf,
      boxSizing: 'border-box',
      width: optionalCall(theme.spaceToCSSValue, props.w),
      minWidth: optionalCall(theme.spaceToCSSValue, props.wMin),
      maxWidth: optionalCall(theme.spaceToCSSValue, props.wMax),
      height: optionalCall(theme.spaceToCSSValue, props.h),
      minHeight: optionalCall(theme.spaceToCSSValue, props.hMin),
      maxHeight: optionalCall(theme.spaceToCSSValue, props.hMax),
      padding: optionalCall(theme.spaceValueToCSSValue, props.p),
      paddingTop: optionalCall(theme.spaceToCSSValue, props.pt),
      paddingBottom: optionalCall(theme.spaceToCSSValue, props.pb),
      paddingRight: optionalCall(theme.spaceToCSSValue, props.pr),
      paddingLeft: optionalCall(theme.spaceToCSSValue, props.pl),
      margin: optionalCall(theme.spaceValueToCSSValue, props.m),
      marginTop: optionalCall(theme.spaceToCSSValue, props.mt),
      marginBottom: optionalCall(theme.spaceToCSSValue, props.mb),
      marginRight: optionalCall(theme.spaceToCSSValue, props.mr),
      marginLeft: optionalCall(theme.spaceToCSSValue, props.ml),
    },
  };
});

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
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          useStyles({ w, wMin, wMax, h, hMin, hMax, p, pt, pb, pr, pl, m, mt, mb, mr, ml, flex, alignSelf })
            .root,
          className
        )}
      />
    );
  }
);
