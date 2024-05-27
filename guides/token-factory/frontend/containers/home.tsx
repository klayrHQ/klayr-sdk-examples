"use client"
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { Button, Stack, Typography } from '@mui/material';
import { PageLayout } from '@/components/layout/pageLayout';

export const ClientHome = () => {
	const {connect, disconnect, session, account} = useWalletConnect()

	return (
		<PageLayout title={"Token Factory"}>
			{
				session ?
					<>
						<Stack className={"gap-4"}>
							<Typography className={'m-auto'} variant={'h2'}>Welcome</Typography>
							<Typography className={'m-auto'}>{account?.address}</Typography>
						</Stack>
						<Button
							onClick={() => disconnect()}
							sx={{ width: 'max-content', marginInline: 'auto', marginTop: '10px' }}
						>
							<Typography>Disconnect Wallet</Typography>
						</Button>
					</>
					:
					<>
						<Typography className={'m-auto'}>Wallet not connected</Typography>
						<Button
							onClick={() => connect()}
							sx={{ width: 'max-content', marginInline: 'auto', marginTop: '10px' }}
						>
							<Typography>Connect Wallet</Typography>
						</Button>
					</>
			}
		</PageLayout>
	);
}