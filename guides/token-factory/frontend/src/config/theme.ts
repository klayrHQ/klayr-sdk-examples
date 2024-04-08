import { createTheme} from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import Inter from '../assets/fonts/Inter-Regular.ttf';

declare module '@mui/material/styles' {
	interface Palette {
		darkBlue: Palette['primary'];
	}

	interface PaletteOptions {
		darkBlue?: PaletteOptions['primary'];
	}
}

const heights = {
	inputHeight: '50px',
};

const borderRadius = {
	default: '8px',
};

const primary = {
	light: '#EAFF66',
	main: '#d4ff00',
	dark: '#b8ff01',
	contrastText: '#1a1a1a',
};

const secondary = {
	light: '#6DB9FE',
	main: '#0d75fd',
	dark: '#0C31E2',
	contrastText: '#FFFFFF',
};

const darkBlue = {
	light: '#0D1421',
	main: '#050516',
	dark: '#0c121d',
	contrastText: '#FFFFFF'
}

const typography: ThemeOptions['typography'] = {
	fontFamily: 'Inter, sans-serif',
	fontSize: 20,
	body1: {
		fontSize: '1.2rem',
	},
	body2: {
		fontSize: '1.5rem',
	},
	button: {
		fontFamily: 'Utendo, Inter, sans-serif',
		fontSize: '1.3rem',
	},
	h1: {
		fontSize: '3rem',
	},
	h2: {
		fontSize: '4rem',
	},
};

const components: ThemeOptions['components'] = {
	MuiCssBaseline: {
		styleOverrides: `
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Inter'), local('Inter-Regular'), url(${Inter}) format('ttf');
        }
      `,
	},
	MuiButton: {
		defaultProps: {
			variant: 'contained',
		},
		styleOverrides: {
			root: ({ ownerState }) => ({
				borderRadius: borderRadius.default,
				...(ownerState.variant === 'contained' &&
					ownerState.color === 'primary' && {
						color: `${primary.contrastText} !important`,
					}),
				...(ownerState.variant === 'text' &&
					ownerState.color === 'primary' && {
						'&:hover': {
							color: primary.dark,
						},
					}),
				...(ownerState.variant === 'text' &&
					ownerState.color === 'secondary' && {
						'&:hover': {
							color: secondary.dark,
						},
					}),
			}),
			contained: {
				border: 'none !important',
			},
			text: {
				backgroundColor: 'transparent !important',
				border: 'none !important',
			},
		},
	},
	MuiIconButton: {
		styleOverrides: {
			root: {
				border: 'none !important',
				aspectRatio: '1/1',
			},
		},
	},
	MuiSelect: {
		styleOverrides: {
			root: {
				borderRadius: borderRadius.default,
				borderColor: '#919EAB',
				borderWidth: '1px',
			},
		},
	},
	MuiTooltip: {
		styleOverrides: {
			popper: {
				fontSize: '1.7rem',
			},
		},
	},
};

const shape: ThemeOptions['shape'] = {
	borderRadius: 8,
};

export const muiLightTheme = createTheme({
	shape,
	palette: {
		mode: 'light',
		primary,
		secondary,
		darkBlue,
		grey: {
			100: '#f3f3f0',
			200: '#e7e7e3',
			300: '#dadad5',
			400: '#C4CDD5',
			500: '#919EAB',
			600: '#637381',
			700: '#454F5B',
			800: '#212B36',
			900: '#1a1a1a',
		},
	},
	typography,
	components: {
		...components,
		MuiInput: {
			styleOverrides: {
				root: {
					borderWidth: '1px',
					borderColor: '#919EAB',
					borderStyle: 'solid',
					borderRadius: borderRadius.default,
					paddingInline: '14px',
					height: heights.inputHeight,
					'&:hover': {
						borderColor: '#1a1a1a',
					},
					'&:focus': {
						borderColor: primary.main,
						borderWidth: '2px',
					},
					'&::before': {
						border: 'none !important',
					},
					'&::after': {
						border: 'none !important',
					},
				},
			},
		},
	},
});

export const muiDarkTheme = createTheme({
	shape,
	palette: {
		mode: 'dark',
		primary,
		secondary,
		darkBlue,
		grey: {
			900: '#f3f3f0',
			800: '#e7e7e3',
			700: '#dadad5',
			600: '#C4CDD5',
			500: '#919EAB',
			400: '#637381',
			300: '#454F5B',
			200: '#212B36',
			100: '#1a1a1a',
		},
	},
	typography,
	components: {
		...components,
		MuiInput: {
			styleOverrides: {
				root: {
					borderWidth: '1px',
					borderColor: '#919EAB',
					borderStyle: 'solid',
					borderRadius: borderRadius.default,
					paddingInline: '14px',
					height: heights.inputHeight,
					'&:hover': {
						borderColor: '#f3f3f0',
					},
					'&:focus': {
						borderColor: primary.main,
						borderWidth: '2px',
					},
					'&::before': {
						border: 'none !important',
					},
					'&::after': {
						border: 'none !important',
					},
				},
			},
		},
	},
});
