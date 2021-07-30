import { CSSProperties } from 'react';
import { isArray, isText } from '@body-link/type-guards';
import {
  EThemeFont,
  IThemeColors,
  IThemeFonts,
  IThemeOptions,
  IThemeShadows,
  TGridCoefficient,
  TSpace,
  TSpaceValue,
} from './types';

export class Theme {
  public readonly options: Readonly<IThemeOptions>;
  public readonly gridSize: number;
  public readonly fonts: IThemeFonts;
  public readonly colors: IThemeColors;
  public readonly shadows: IThemeShadows;

  public constructor(options: IThemeOptions) {
    this.options = options;
    this.gridSize = options.gridSize;
    this.fonts = options.fonts;
    this.colors = options.colors;
    this.shadows = options.shadows;
  }

  public px = (value: number): string => `${value}px`;

  public getFont = (fontName: EThemeFont): CSSProperties => this.fonts[fontName];

  public gridCoefficientToNumber = (gridCoefficient: TGridCoefficient): number =>
    Math.round(this.gridSize * gridCoefficient);

  public spaceToCSSValue = (space: TSpace): string =>
    isText(space) ? space : this.px(this.gridCoefficientToNumber(space));

  public spaceValueToCSSValue = (spaceValue: TSpaceValue): string =>
    isArray(spaceValue) ? spaceValue.map(this.spaceToCSSValue).join(' ') : this.spaceToCSSValue(spaceValue);
}

export const createTheme = (themeOptions: IThemeOptions): Theme => new Theme(themeOptions);
