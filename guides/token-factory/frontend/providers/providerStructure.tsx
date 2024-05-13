"use client"
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { WalletConnectProvider } from '@/providers/walletConnectProvider';
import { ThemeProvider } from '@/providers/themeProvider';

export const ProviderStructure = ({children}: {children: ReactNode}) => {
	return (
		<ThemeProvider>
			<WalletConnectProvider>
				{children}
			</WalletConnectProvider>
		</ThemeProvider>
	)
}