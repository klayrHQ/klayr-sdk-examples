"use client"
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { Box, Button, Stack, Typography } from '@mui/material';

export const ClientHome = () => {
	const {connect, session, addresses, publicKeys} = useWalletConnect()

	return (
		<Box>
			<Stack>
				{
					session ?
						<Typography className={"m-auto"}>{JSON.stringify(publicKeys)}</Typography>
						:
						<Typography className={"m-auto"}>Wallet not connected</Typography>
				}
				<Button
					onClick={() => connect()}
					sx={{width: 'max-content', marginInline: 'auto', marginTop: '10px'}}
				>
					Connect Wallet
				</Button>
			</Stack>
		</Box>
	);
}