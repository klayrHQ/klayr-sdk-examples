"use client"
import { Box } from '@mui/material';
import { Mint, Burn, Transfer, BatchTransfer } from '@/components/tokens/actions';
import { useState } from 'react';

export const TokenActionsModal = () => {
	const [currentTab, setCurrentTab] = useState()

	const tabs = [
		{
			name: "Mint",
			content: <Mint />,
		},
		{
			name: "Burn",
			content: <Burn />,
		},
		{
			name: "Transfer",
			content: <Transfer />,
		},
		{
			name: "Batch Transfer",
			content: <BatchTransfer />,
		},
	]

	return (
		<Box>

		</Box>
	)
}