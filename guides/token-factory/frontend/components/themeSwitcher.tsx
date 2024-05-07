"use client"
import React from 'react';
import { IconButton, SxProps } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '@/providers/themeProvider';
import { cls } from '@/utils/functions';

export const ThemeSwitcher = ({ className, sx }: {className?: string, sx?: SxProps}) => {
	const {themeMode, switchThemeMode} = useTheme()

	return (
			<IconButton
				className={cls(["relative", className])}
				onClick={() => {
					switchThemeMode();
					//setThemeMode(themeMode === "light" ? "dark" : "light");
				}}
				sx={sx}
			>
				<LightMode
					className={cls([
						"text-white absolute transition-all ease duration-200",
						themeMode === "light" ? "opacity-1 rotate-0" : "opacity-0 rotate-180",
					])}
				/>
				<DarkMode
					className={cls([
						"text-white absolute transition-all ease duration-200",
						themeMode === "dark" ? "opacity-1 rotate-0" : "opacity-0 rotate-180",
					])}
				/>
				{/*themeMode === "light" ? <LightMode sx={{color: "white"}} /> : <DarkMode sx={{color: "white"}} />*/}
			</IconButton>
	)
}