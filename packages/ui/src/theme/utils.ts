import { css, CSSObject } from '@emotion/css';
import memoizeOne, { EqualityFn } from 'memoize-one';
import { Theme } from './Theme';
import { useTheme } from './ThemeProvider';
import { isObjectShallowEqual } from '@body-link/helpers';

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
export function makeStyles<Props, Classes extends string = 'root'>(
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
