export interface IThemeOptions {
  gridSize: number;
  colorSets: Record<EThemeColorSetName, IThemeColorSet>;
}

export enum EThemeColorSetName {
  White = 'White',
}

export interface IThemeColorSet {
  base: string;
  counter: string;
  text: string;
}

export type TGridCoefficient = number;
export type TSpace = string | TGridCoefficient;
export type TSpaceValue =
  | TSpace
  | [TSpace, TSpace]
  | [TSpace, TSpace, TSpace]
  | [TSpace, TSpace, TSpace, TSpace];
