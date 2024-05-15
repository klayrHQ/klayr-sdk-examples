"use client"
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { Button, Typography } from '@mui/material';
import { PageLayout } from '@/components/layout/pageLayout';

export const ClientHome = () => {
	const {connect, disconnect, session, address, publicKey} = useWalletConnect()

	return (
		<PageLayout title={"Token Factory"}>
			{
				session ?
					<>
						<Typography className={'m-auto'}>{JSON.stringify(address)}</Typography>
						<Button
							onClick={() => disconnect()}
							sx={{ width: 'max-content', marginInline: 'auto', marginTop: '10px' }}
						>
							Disconnect Wallet
						</Button>
					</>
					:
					<>
						<Typography className={'m-auto'}>Wallet not connected</Typography>
						<Button
							onClick={() => connect()}
							sx={{ width: 'max-content', marginInline: 'auto', marginTop: '10px' }}
						>
							Connect Wallet
						</Button>
					</>
			}
		</PageLayout>
	);
}