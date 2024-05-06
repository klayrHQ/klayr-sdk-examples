"use client"
import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '@/providers/themeProvider';
import { cls } from '@/utils/functions';

export const ThemeSwitcher = () => {
	const {themeMode, switchThemeMode} = useTheme()

	return (
			<IconButton
				className={"relative"}
				onClick={() => {
					switchThemeMode();
					//setThemeMode(themeMode === "light" ? "dark" : "light");
				}}
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