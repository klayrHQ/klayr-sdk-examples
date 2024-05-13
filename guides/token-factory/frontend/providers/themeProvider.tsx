"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { muiDarkTheme, muiLightTheme } from '@/config/theme';

interface ThemeProviderProps {
	themeMode: "light" | "dark"
	updateTheme: () => void
	getCurrentTheme: () => "light" | "dark"
	switchThemeMode: () => void
	setThemeMode: (mode: "light" | "dark") => void
}

export const ThemeContext = createContext<ThemeProviderProps>(
	{} as ThemeProviderProps,
);

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: {
	children: ReactNode;
}) => {
	const [themeMode, setThemeModeState] = useState<"light" | "dark">("light")

	const updateTheme = () => {
		switch (getCurrentTheme()) {
			case "dark":
				document.documentElement.classList.add("dark");
				document.documentElement.classList.remove("light");
				document.documentElement.setAttribute("color-theme", "dark");
				setThemeModeState("dark")
				break;
			default:
				document.documentElement.classList.remove("dark");
				document.documentElement.classList.add("light");
				document.documentElement.setAttribute("color-theme", "light");
				setThemeModeState("light");
		}
	};

	const getCurrentTheme = (): "dark" | "light" => {
		if (
			!window.localStorage.getItem("theme") ||
			window.localStorage.getItem("theme") === "system"
		) {
			if (window.matchMedia("(prefers-color-scheme: dark").matches) {
				return "dark";
			}
			return "light";
		}
		return window.localStorage.getItem("theme") as "dark" | "light";
	};

	const switchThemeMode = () => {
		if (getCurrentTheme() === "dark") {
			setThemeMode("light")
			return
		}
		setThemeMode("dark")
	};

	const setThemeMode = (mode: "light" | "dark") => {
		window.localStorage.setItem("theme", mode);
		updateTheme();
	};

	useEffect(() => {
		const themeMode = getCurrentTheme();

		if (themeMode) setThemeModeState(themeMode);
	}, [])

	return (
		<ThemeContext.Provider
			value={{
				themeMode,
				updateTheme,
				getCurrentTheme,
				switchThemeMode,
				setThemeMode,
			}}
		>
			<MuiThemeProvider theme={themeMode === "light" ? muiLightTheme : muiDarkTheme}>
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	)

};