import { CSSProperties } from 'react';

export interface IThemeOptions {
  gridSize: number;
  colors: IThemeColors;
  fonts: IThemeFonts;
}

export interface IThemeColors {
  container: IThemeColorsContainer;
  indicator: IThemeColorsIndicator;
  interactive: IThemeColorsInteractive;
}

export interface IThemeColorsContainer {
  bg: string;
  border: string;
}

export interface IThemeColorsIndicator {
  base: string;
  baseMute: string;
}

export interface IThemeColorsInteractive {
  base: string;
  baseRise: string;
  baseMute: string;
  bg: string;
  bgRise: string;
  text: string;
  textRise: string;
  textMute: string;
  error: string;
  errorMute: string;
  invite: string;
}

export enum EThemeFont {
  BodyLine = 'BodyLine',
  BodyShort = 'BodyShort',
  BodyLong = 'BodyLong',
  Label = 'Label',
  Caption = 'Caption',
  Heading1 = 'Heading1',
  Heading2 = 'Heading2',
}

export interface IThemeFonts extends Record<EThemeFont, CSSProperties> {}

export type TGridCoefficient = number;
export type TSpace = string | TGridCoefficient;
export type TSpaceValue =
  | TSpace
  | [TSpace, TSpace]
  | [TSpace, TSpace, TSpace]
  | [TSpace, TSpace, TSpace, TSpace];
