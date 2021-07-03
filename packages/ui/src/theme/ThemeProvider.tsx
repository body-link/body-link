import React, { useContext } from 'react';
import { Theme } from './Theme';
import { defaultTheme } from './default-theme';

const ThemeContext: React.Context<Theme> = React.createContext<Theme>(defaultTheme);
ThemeContext.displayName = 'BodyLinkTheme';

export const ThemeProvider: React.FC<{ theme?: Theme }> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme ?? defaultTheme}>{children}</ThemeContext.Provider>
);

export const useTheme = (): Theme => useContext(ThemeContext);
