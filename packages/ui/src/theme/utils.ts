import { css, CSSObject } from '@emotion/css';
import memoizeOne, { EqualityFn } from 'memoize-one';
import { isObjectShallowEqual, optionalCall } from '@body-link/helpers';
import { Theme } from './Theme';
import { useTheme } from './ThemeProvider';
import { IFlexItem, ISizing, ISpacing } from './types';

const isEqual = (
  [nextTheme, nextProps]: [Theme, unknown],
  [prevTheme, prevProps]: [Theme, unknown]
): boolean => {
  if (nextTheme !== prevTheme) {
    return false;
  }
  return isObjectShallowEqual(nextProps, prevProps);
};

export function makeStyles<Classes extends string>(
  styleCreator: (theme: Theme) => Record<Classes, CSSObject>
): () => Record<Classes, string>;
// eslint-disable-next-line @typescript-eslint/ban-types
export function makeStyles<Props extends {}, Classes extends string = 'root'>(
  styleCreator: (theme: Theme, props: Props) => Record<Classes, CSSObject>
): (props: Props) => Record<Classes, string>;
export function makeStyles<Props, Classes extends string>(
  styleCreator: (theme: Theme, props?: Props) => Record<Classes, CSSObject>
): (props?: Props) => Record<Classes, string> {
  const getStyles = memoizeOne((theme: Theme, props?: Props): Record<Classes, string> => {
    const result = {} as Record<Classes, string>;
    const items = styleCreator(theme, props);
    for (const itemKey in items) {
      if (items.hasOwnProperty(itemKey)) {
        result[itemKey] = css(items[itemKey]);
      }
    }
    return result;
  }, isEqual as EqualityFn);
  return (props?: Props) => {
    const theme = useTheme();
    return getStyles(theme, props);
  };
}

export const important = (val: string | number): string => `${val}!important`;

export const $initial: string = css({
  all: 'initial',
});

export const $borderBox: string = css({
  boxSizing: 'border-box',
});

export const $overflowHidden: string = css({
  overflow: 'hidden',
});

// eslint-disable-next-line @rushstack/typedef-var
export const useStylesSizing = makeStyles<ISizing>((theme, props) => {
  return {
    root: {
      width: optionalCall(theme.spaceToCSSValue, props.w),
      minWidth: optionalCall(theme.spaceToCSSValue, props.wMin),
      maxWidth: optionalCall(theme.spaceToCSSValue, props.wMax),
      height: optionalCall(theme.spaceToCSSValue, props.h),
      minHeight: optionalCall(theme.spaceToCSSValue, props.hMin),
      maxHeight: optionalCall(theme.spaceToCSSValue, props.hMax),
    },
  };
});

// eslint-disable-next-line @rushstack/typedef-var
export const useStylesSpacing = makeStyles<ISpacing>((theme, props) => {
  return {
    root: {
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
export const useStylesFlexItem = makeStyles<IFlexItem>((theme, props) => {
  return {
    root: {
      flex: props.flex,
      alignSelf: props.alignSelf,
    },
  };
});
