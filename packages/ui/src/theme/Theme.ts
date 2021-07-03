import { isArray, isText } from '@body-link/type-guards';
import { IThemeOptions, TSpace, TSpaceValue } from './types';

export class Theme {
  public options: Readonly<IThemeOptions>;
  public color: IThemeOptions['color'];

  public constructor(options: IThemeOptions) {
    this.options = options;
    this.color = this.options.color;
  }

  public spaceToCSSValue = (space: TSpace): string =>
    isText(space) ? space : `${Math.round(this.options.gridSize * space)}px`;

  public spaceValueToCSSValue = (spaceValue: TSpaceValue): string =>
    isArray(spaceValue) ? spaceValue.map(this.spaceToCSSValue).join(' ') : this.spaceToCSSValue(spaceValue);
}

export const createTheme = (themeOptions: IThemeOptions): Theme => new Theme(themeOptions);
