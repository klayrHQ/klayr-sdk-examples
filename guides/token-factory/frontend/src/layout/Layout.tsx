import { muiLightTheme } from '../config/theme';
import { Header } from './Header';
import { Box, ThemeProvider } from '@mui/material';
import React from 'react';

export const Layout = ({ children }: {children: any}) => {
	return (
		<ThemeProvider theme={muiLightTheme}>
			<div className="App">
				<Header/>
				<Box component={"div"} sx={{padding: "50px 0px"}}>
					{children}
				</Box>
			</div>
		</ThemeProvider>
	)
}