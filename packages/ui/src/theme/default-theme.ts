import { IThemeOptions } from './types';
import { createTheme, Theme } from './Theme';

export const defaultThemeOptions: IThemeOptions = {
  gridSize: 8,
  color: {
    white: {
      base: '#fff',
      counter: '#000',
      text: '#444',
    },
  },
};

export const defaultTheme: Theme = createTheme(defaultThemeOptions);
