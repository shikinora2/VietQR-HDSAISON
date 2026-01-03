import React, { createContext, useContext } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { darkTheme } from '../styles/theme';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Always use dark theme
    const themeName = 'dark';
    const theme = darkTheme;
    const isDark = true;

    // Stub functions for compatibility
    const toggleTheme = () => { };
    const setTheme = () => { };

    return (
        <ThemeContext.Provider value={{ themeName, isDark, toggleTheme, setTheme }}>
            <StyledThemeProvider theme={theme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
