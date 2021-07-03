import { IThemeOptions, EThemeColorSetName } from './types';
import { createTheme, Theme } from './Theme';

export const defaultThemeOptions: IThemeOptions = {
  gridSize: 8,
  colorSets: {
    [EThemeColorSetName.White]: {
      base: '#fff',
      counter: '#000',
      text: '#444',
    },
  },
};

export const defaultTheme: Theme = createTheme(defaultThemeOptions);
