// src/theme.js
import { createTheme, alpha } from '@mui/material/styles';

// Brand colors, tuned separately for each mode so contrast holds in both.
const palettes = {
  light: {
    primary: { main: '#4f46e5', light: '#6366f1', dark: '#4338ca', contrastText: '#ffffff' },
    secondary: { main: '#0d9488', light: '#14b8a6', dark: '#0f766e', contrastText: '#ffffff' },
    error: { main: '#dc2626' },
    warning: { main: '#d97706' },
    success: { main: '#059669' },
    background: { default: '#f6f7fb', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
    divider: '#e2e8f0',
  },
  dark: {
    primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1', contrastText: '#0b0f19' },
    secondary: { main: '#2dd4bf', light: '#5eead4', dark: '#14b8a6', contrastText: '#0b0f19' },
    error: { main: '#f87171' },
    warning: { main: '#fbbf24' },
    success: { main: '#34d399' },
    background: { default: '#0b0f19', paper: '#121826' },
    text: { primary: '#e2e8f0', secondary: '#94a3b8' },
    divider: '#1f2937',
  },
};

export const getTheme = (mode) => {
  const palette = palettes[mode];

  return createTheme({
    palette: { mode, ...palette },
    shape: { borderRadius: 10 },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontWeight: 800, letterSpacing: '-0.03em' },
      h3: { fontWeight: 800, letterSpacing: '-0.025em', fontSize: '2.5rem' },
      h4: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.875rem' },
      h5: { fontWeight: 700, letterSpacing: '-0.015em' },
      h6: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.0625rem' },
      button: { textTransform: 'none', fontWeight: 600 },
      overline: { fontWeight: 700, letterSpacing: '0.08em' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
          '::selection': {
            backgroundColor: alpha(palette.primary.main, 0.25),
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 10, paddingInline: 18 },
          sizeLarge: { paddingBlock: 12, paddingInline: 24, fontSize: '1rem' },
          sizeSmall: { paddingInline: 12 },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiPaper: {
        styleOverrides: {
          // MUI lightens dark-mode paper with a gradient overlay; solid surfaces read cleaner.
          root: { backgroundImage: 'none' },
          outlined: { borderColor: palette.divider },
        },
      },
      MuiCard: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: { root: { borderRadius: 16 } },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 16, border: `1px solid ${palette.divider}` },
        },
      },
      MuiDialogTitle: {
        styleOverrides: { root: { fontWeight: 700, fontSize: '1.25rem', paddingTop: 20 } },
      },
      MuiDialogActions: {
        styleOverrides: { root: { padding: '12px 24px 20px', gap: 8 } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 10 },
          notchedOutline: { borderColor: palette.divider },
        },
      },
      MuiAccordion: {
        defaultProps: { disableGutters: true, elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${palette.divider}`,
            borderRadius: 12,
            overflow: 'hidden',
            '&:before': { display: 'none' },
            '&:not(:last-of-type)': { marginBottom: 12 },
            '&:first-of-type, &:last-of-type': { borderRadius: 12 },
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'inherit' },
        styleOverrides: {
          root: {
            backgroundColor: alpha(palette.background.paper, 0.8),
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: { paper: { borderRight: `1px solid ${palette.divider}` } },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            '&.Mui-selected, &.Mui-selected:hover': {
              backgroundColor: alpha(palette.primary.main, 0.12),
              color: palette.primary.main,
              '& .MuiListItemIcon-root': { color: palette.primary.main },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
      MuiTooltip: {
        styleOverrides: { tooltip: { fontSize: '0.75rem', borderRadius: 6 } },
      },
    },
  });
};
