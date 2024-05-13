"use client"
import { Button, Popover, PopoverProps, Stack, Typography } from '@mui/material';
import { useWalletConnect } from '@/providers/walletConnectProvider';

export const WalletPopover = ({...props}: PopoverProps) => {
	const { address, disconnect } = useWalletConnect()

	return (
		<Popover
			anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
			anchorPosition={{ left: 0, top: 4 }}
			{...props}
		>
			<Stack className={"p-4 w-[300px] gap-6"}>
				<Stack className={"gap-1"}>
					<Typography>Wallet address:</Typography>
					<Typography title={address}>{address?.substring(0, 22)}...</Typography>
				</Stack>
				<Button onClick={disconnect}>Disconnect</Button>
			</Stack>
		</Popover>
	)
}