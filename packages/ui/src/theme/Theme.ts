import { isArray, isText } from '@body-link/type-guards';
import { EThemeColorSetName, IThemeColorSet, IThemeOptions, TSpace, TSpaceValue } from './types';

export class Theme {
  public options: Readonly<IThemeOptions>;
  public defaultColorSet: IThemeColorSet;

  private readonly _colorSets: Record<EThemeColorSetName, IThemeColorSet>;

  public constructor(options: IThemeOptions) {
    this.options = options;
    this._colorSets = this.options.colorSets;
    this.defaultColorSet = this.getColorSet(EThemeColorSetName.White);
  }

  public px = (value: number): string => `${value}px`;

  public getColorSet = (colorSetName: EThemeColorSetName): IThemeColorSet => this._colorSets[colorSetName];

  public spaceToCSSValue = (space: TSpace): string =>
    isText(space) ? space : this.px(Math.round(this.options.gridSize * space));

  public spaceValueToCSSValue = (spaceValue: TSpaceValue): string =>
    isArray(spaceValue) ? spaceValue.map(this.spaceToCSSValue).join(' ') : this.spaceToCSSValue(spaceValue);
}

export const createTheme = (themeOptions: IThemeOptions): Theme => new Theme(themeOptions);
