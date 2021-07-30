import { CSSObject } from '@emotion/css';

export interface IThemeOptions {
  gridSize: number;
  colors: IThemeColors;
  fonts: IThemeFonts;
  shadows: IThemeShadows;
}

export interface IThemeShadows {
  overlay: string;
}

export interface IThemeColors {
  button: IThemeColorsButton;
  container: IThemeColorsContainer;
  indicator: IThemeColorsIndicator;
  interactive: IThemeColorsInteractive;
}

export interface IThemeColorsButton {
  primary: string;
  primaryText: string;
  primaryHover: string;
  primaryDimmer: string;
  secondary: string;
  secondaryText: string;
  secondaryHover: string;
  secondaryDimmer: string;
  tertiaryDimmer: string;
  danger: string;
  dangerText: string;
  dangerHover: string;
  dangerDimmer: string;
  subtleHover: string;
  subtleDimmer: string;
  disabled1: string;
  disabled2: string;
  disabled3: string;
  disabled4: string;
  disabledDimmer: string;
}

export interface IThemeColorsContainer {
  base: string;
  solid: string;
  solidText: string;
  dimmed: string;
  dimmedText: string;
  highlighted: string;
  highlightedText: string;
  hoverable: string;
  hoverableText: string;
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
  Code1 = 'Code1',
  Code2 = 'Code2',
}

export interface IThemeFonts extends Record<EThemeFont, CSSObject> {}

export type TGridCoefficient = number;
export type TSpace = string | TGridCoefficient;
export type TSpaceValue =
  | TSpace
  | [TSpace, TSpace]
  | [TSpace, TSpace, TSpace]
  | [TSpace, TSpace, TSpace, TSpace];
