"use client"
import { Button } from '@mui/material';
import { useWalletConnect } from '@/providers/walletConnectProvider';

export const ConnectWalletButton = () => {
	const { connect, session } = useWalletConnect()

	return (
		<>
			{
				!session ?
				<Button onClick={() => connect()} sx={{ width: 'max-content', marginInline: 'auto', marginTop: '10px' }}>
					Connect Wallet
				</Button> :
				<Button	 sx={{width: 'max-content', marginInline: 'auto', marginTop: '10px'}}>
					Wallet
				</Button>
			}
		</>
	)
}