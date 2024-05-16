"use client"
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { WalletConnectProvider } from '@/providers/walletConnectProvider';
import { ThemeProvider } from '@/providers/themeProvider';
import { SchemasProvider } from '@/providers/schemaProvider';

export const ProviderStructure = ({children}: {children: ReactNode}) => {
	return (
		<ThemeProvider>
			<SchemasProvider>
				<WalletConnectProvider>
					{children}
				</WalletConnectProvider>
			</SchemasProvider>
		</ThemeProvider>
	)
}