import { CSSObject } from '@emotion/css';
import { createTheme, Theme } from './Theme';
import { EThemeFont, IThemeOptions } from './types';

// eslint-disable-next-line @rushstack/typedef-var
const PRIMITIVE_COLORS = {
  // From IBM Carbon Design System
  Alert20: 'rgba(241, 194, 27, 1)',
  Alert40: 'rgba(255, 131, 43, 1)',
  Alert50: 'rgba(36, 161, 72, 1)',
  Alert60: 'rgba(218, 30, 40, 1)',
  Black: 'rgba(0, 0, 0, 1)',
  Blue10: 'rgba(237, 245, 255, 1)',
  Blue100: 'rgba(0, 17, 65, 1)',
  Blue20: 'rgba(208, 226, 255, 1)',
  Blue30: 'rgba(166, 200, 255, 1)',
  Blue40: 'rgba(120, 169, 255, 1)',
  Blue50: 'rgba(69, 137, 255, 1)',
  Blue60: 'rgba(15, 98, 254, 1)',
  Blue70: 'rgba(0, 67, 206, 1)',
  Blue80: 'rgba(0, 45, 156, 1)',
  Blue90: 'rgba(0, 29, 108, 1)',
  CoolGray10: 'rgba(242, 244, 248, 1)',
  CoolGray100: 'rgba(18, 22, 25, 1)',
  CoolGray20: 'rgba(221, 225, 230, 1)',
  CoolGray30: 'rgba(193, 199, 205, 1)',
  CoolGray40: 'rgba(162, 169, 176, 1)',
  CoolGray50: 'rgba(135, 141, 150, 1)',
  CoolGray60: 'rgba(105, 112, 119, 1)',
  CoolGray70: 'rgba(77, 83, 88, 1)',
  CoolGray80: 'rgba(52, 58, 63, 1)',
  CoolGray90: 'rgba(33, 39, 42, 1)',
  Cyan10: 'rgba(229, 246, 255, 1)',
  Cyan100: 'rgba(6, 23, 39, 1)',
  Cyan20: 'rgba(186, 230, 255, 1)',
  Cyan30: 'rgba(130, 207, 255, 1)',
  Cyan40: 'rgba(51, 177, 255, 1)',
  Cyan50: 'rgba(17, 146, 232, 1)',
  Cyan60: 'rgba(0, 114, 195, 1)',
  Cyan70: 'rgba(0, 83, 154, 1)',
  Cyan80: 'rgba(0, 58, 109, 1)',
  Cyan90: 'rgba(1, 39, 73, 1)',
  Gray10: 'rgba(244, 244, 244, 1)',
  Gray100: 'rgba(22, 22, 22, 1)',
  Gray20: 'rgba(224, 224, 224, 1)',
  Gray30: 'rgba(198, 198, 198, 1)',
  Gray40: 'rgba(168, 168, 168, 1)',
  Gray50: 'rgba(141, 141, 141, 1)',
  Gray60: 'rgba(111, 111, 111, 1)',
  Gray70: 'rgba(82, 82, 82, 1)',
  Gray80: 'rgba(57, 57, 57, 1)',
  Gray90: 'rgba(38, 38, 38, 1)',
  Green10: 'rgba(222, 251, 230, 1)',
  Green100: 'rgba(7, 25, 8, 1)',
  Green20: 'rgba(167, 240, 186, 1)',
  Green30: 'rgba(111, 220, 140, 1)',
  Green40: 'rgba(66, 190, 101, 1)',
  Green50: 'rgba(36, 161, 72, 1)',
  Green60: 'rgba(25, 128, 56, 1)',
  Green70: 'rgba(14, 96, 39, 1)',
  Green80: 'rgba(4, 67, 23, 1)',
  Green90: 'rgba(2, 45, 13, 1)',
  Magenta10: 'rgba(255, 240, 247, 1)',
  Magenta100: 'rgba(42, 10, 24, 1)',
  Magenta20: 'rgba(255, 214, 232, 1)',
  Magenta30: 'rgba(255, 175, 210, 1)',
  Magenta40: 'rgba(255, 126, 182, 1)',
  Magenta50: 'rgba(238, 83, 150, 1)',
  Magenta60: 'rgba(209, 39, 113, 1)',
  Magenta70: 'rgba(159, 24, 83, 1)',
  Magenta80: 'rgba(116, 9, 55, 1)',
  Magenta90: 'rgba(81, 2, 36, 1)',
  Purple10: 'rgba(246, 242, 255, 1)',
  Purple100: 'rgba(28, 15, 48, 1)',
  Purple20: 'rgba(232, 218, 255, 1)',
  Purple30: 'rgba(212, 187, 255, 1)',
  Purple40: 'rgba(190, 149, 255, 1)',
  Purple50: 'rgba(165, 110, 255, 1)',
  Purple60: 'rgba(138, 63, 252, 1)',
  Purple70: 'rgba(105, 41, 196, 1)',
  Purple80: 'rgba(73, 29, 139, 1)',
  Purple90: 'rgba(49, 19, 94, 1)',
  Red10: 'rgba(255, 241, 241, 1)',
  Red100: 'rgba(45, 7, 9, 1)',
  Red20: 'rgba(255, 215, 217, 1)',
  Red30: 'rgba(255, 179, 184, 1)',
  Red40: 'rgba(255, 131, 137, 1)',
  Red50: 'rgba(250, 77, 86, 1)',
  Red60: 'rgba(218, 30, 40, 1)',
  Red70: 'rgba(162, 25, 31, 1)',
  Red80: 'rgba(117, 14, 19, 1)',
  Red90: 'rgba(82, 4, 8, 1)',
  Teal10: 'rgba(217, 251, 251, 1)',
  Teal100: 'rgba(8, 26, 28, 1)',
  Teal20: 'rgba(158, 240, 240, 1)',
  Teal30: 'rgba(61, 219, 217, 1)',
  Teal40: 'rgba(8, 189, 186, 1)',
  Teal50: 'rgba(0, 157, 154, 1)',
  Teal60: 'rgba(0, 125, 121, 1)',
  Teal70: 'rgba(0, 93, 93, 1)',
  Teal80: 'rgba(0, 65, 68, 1)',
  Teal90: 'rgba(2, 43, 48, 1)',
  WarmGray10: 'rgba(247, 243, 242, 1)',
  WarmGray100: 'rgba(23, 20, 20, 1)',
  WarmGray20: 'rgba(229, 224, 223, 1)',
  WarmGray30: 'rgba(202, 197, 196, 1)',
  WarmGray40: 'rgba(173, 168, 168, 1)',
  WarmGray50: 'rgba(143, 139, 139, 1)',
  WarmGray60: 'rgba(115, 111, 111, 1)',
  WarmGray70: 'rgba(86, 81, 81, 1)',
  WarmGray80: 'rgba(60, 56, 56, 1)',
  WarmGray90: 'rgba(39, 37, 37, 1)',
  White: 'rgba(255, 255, 255, 1)',

  // BL extension
  Blue15: '#DFECFF',
};

// eslint-disable-next-line @rushstack/typedef-var
const PRIMITIVE_TRANSPARENT_COLORS = {
  Light20: 'rgba(255, 255, 255, .2)',
  Light60: 'rgba(255, 255, 255, .6)',
  Light70: 'rgba(255, 255, 255, .7)',
};

// eslint-disable-next-line @rushstack/typedef-var
const PRIMITIVE_FONT_FAMILIES = {
  mono: "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace",
  sans: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
  sansCondensed: "'IBM Plex Sans Condensed', 'Helvetica Neue', Arial, sans-serif",
  sansHebrew: "'IBM Plex Sans Hebrew', 'Helvetica Hebrew', 'Arial Hebrew', sans-serif",
  serif: "'IBM Plex Serif', 'Georgia', Times, serif",
};

// eslint-disable-next-line @rushstack/typedef-var
const PRIMITIVE_FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semiBold: 600,
};

const GRID_SIZE: number = 8;

const fontBase: CSSObject = {
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
};

export const defaultThemeOptions: IThemeOptions = {
  gridSize: GRID_SIZE,
  colors: {
    button: {
      primary: PRIMITIVE_COLORS.Blue60,
      primaryText: PRIMITIVE_COLORS.White,
      primaryHover: PRIMITIVE_COLORS.Blue70,
      primaryDimmer: PRIMITIVE_TRANSPARENT_COLORS.Light60,
      secondary: PRIMITIVE_COLORS.WarmGray80,
      secondaryText: PRIMITIVE_COLORS.White,
      secondaryHover: PRIMITIVE_COLORS.WarmGray70,
      secondaryDimmer: PRIMITIVE_TRANSPARENT_COLORS.Light70,
      tertiaryDimmer: PRIMITIVE_TRANSPARENT_COLORS.Light60,
      danger: PRIMITIVE_COLORS.Red60,
      dangerText: PRIMITIVE_COLORS.White,
      dangerHover: PRIMITIVE_COLORS.Red70,
      dangerDimmer: PRIMITIVE_TRANSPARENT_COLORS.Light60,
      subtleHover: PRIMITIVE_COLORS.WarmGray20,
      subtleDimmer: PRIMITIVE_TRANSPARENT_COLORS.Light60,
      disabled1: PRIMITIVE_COLORS.Gray30,
      disabled2: PRIMITIVE_COLORS.Gray40,
      disabled3: PRIMITIVE_COLORS.Gray50,
      disabled4: PRIMITIVE_COLORS.Gray60,
      disabledDimmer: PRIMITIVE_TRANSPARENT_COLORS.Light20,
    },
    container: {
      base: PRIMITIVE_COLORS.WarmGray80,
      solid: PRIMITIVE_COLORS.White,
      solidText: PRIMITIVE_COLORS.Black,
      dimmed: PRIMITIVE_COLORS.WarmGray10,
      dimmedText: PRIMITIVE_COLORS.Black,
      highlighted: PRIMITIVE_COLORS.WarmGray20,
      highlightedText: PRIMITIVE_COLORS.Black,
      hoverable: PRIMITIVE_COLORS.Blue15,
      hoverableText: PRIMITIVE_COLORS.Black,
    },
    indicator: {
      base: PRIMITIVE_COLORS.Blue60,
      baseMute: PRIMITIVE_COLORS.WarmGray30,
    },
    interactive: {
      base: PRIMITIVE_COLORS.WarmGray80,
      baseRise: PRIMITIVE_COLORS.WarmGray30,
      baseMute: PRIMITIVE_COLORS.WarmGray20,
      bg: PRIMITIVE_COLORS.WarmGray10,
      bgRise: PRIMITIVE_COLORS.White,
      text: PRIMITIVE_COLORS.Black,
      textRise: PRIMITIVE_COLORS.White,
      textMute: PRIMITIVE_COLORS.WarmGray50,
      error: PRIMITIVE_COLORS.Red60,
      errorMute: PRIMITIVE_COLORS.Red20,
      invite: PRIMITIVE_COLORS.Blue60,
    },
  },
  fonts: {
    [EThemeFont.BodyLine]: {
      ...fontBase,
      fontFamily: PRIMITIVE_FONT_FAMILIES.sans,
      fontWeight: PRIMITIVE_FONT_WEIGHTS.regular,
      fontStyle: 'normal',
      fontSize: '14px',
      lineHeight: '16px',
      letterSpacing: '0.16px',
    },
    [EThemeFont.BodyShort]: {
      ...fontBase,
      fontFamily: PRIMITIVE_FONT_FAMILIES.sans,
      fontWeight: PRIMITIVE_FONT_WEIGHTS.regular,
      fontStyle: 'normal',
      fontSize: '14px',
      lineHeight: '18px',
      letterSpacing: '0.16px',
    },
    [EThemeFont.BodyLong]: {
      ...fontBase,
      fontFamily: PRIMITIVE_FONT_FAMILIES.sans,
      fontWeight: PRIMITIVE_FONT_WEIGHTS.regular,
      fontStyle: 'normal',
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0.16px',
    },
    [EThemeFont.Label]: {
      ...fontBase,
      fontFamily: PRIMITIVE_FONT_FAMILIES.sans,
      fontWeight: PRIMITIVE_FONT_WEIGHTS.medium,
      fontStyle: 'normal',
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0.32px',
    },
    [EThemeFont.Caption]: {
      ...fontBase,
      fontFamily: PRIMITIVE_FONT_FAMILIES.sans,
      fontWeight: PRIMITIVE_FONT_WEIGHTS.regular,
      fontStyle: 'normal',
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0.32px',
    },
    [EThemeFont.Heading1]: {
      ...fontBase,
      fontFamily: PRIMITIVE_FONT_FAMILIES.sans,
      fontWeight: PRIMITIVE_FONT_WEIGHTS.semiBold,
      fontStyle: 'normal',
      fontSize: '14px',
      lineHeight: '18px',
      letterSpacing: '0.16px',
    },
    [EThemeFont.Heading2]: {
      ...fontBase,
      fontFamily: PRIMITIVE_FONT_FAMILIES.sans,
      fontWeight: PRIMITIVE_FONT_WEIGHTS.semiBold,
      fontStyle: 'normal',
      fontSize: '16px',
      lineHeight: '22px',
      letterSpacing: 0,
    },
    [EThemeFont.Code1]: {
      ...fontBase,
      fontFamily: PRIMITIVE_FONT_FAMILIES.mono,
      fontWeight: PRIMITIVE_FONT_WEIGHTS.regular,
      fontStyle: 'normal',
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0.32px',
    },
    [EThemeFont.Code2]: {
      ...fontBase,
      fontFamily: PRIMITIVE_FONT_FAMILIES.mono,
      fontWeight: PRIMITIVE_FONT_WEIGHTS.regular,
      fontStyle: 'normal',
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0.32px',
    },
  },
  shadows: {
    overlay: `0px ${GRID_SIZE * 2}px ${GRID_SIZE * 7.75}px rgba(0, 0, 0, 0.15)`,
  },
};

export const defaultTheme: Theme = createTheme(defaultThemeOptions);
