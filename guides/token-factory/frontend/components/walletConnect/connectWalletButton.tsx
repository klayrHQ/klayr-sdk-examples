"use client"
import { Box, Button, Typography } from '@mui/material';
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { WalletModal } from '@/components/walletConnect/walletModal';
import { useRef, useState } from 'react';
import { cls } from '@/utils/functions';

export const ConnectWalletButton = ({buttonClassName}: {buttonClassName?: string}) => {
	const { connect, session } = useWalletConnect();
	const [openWallet, setOpenWallet] = useState(false);
	const toggleWallet = () => {
		setOpenWallet(!openWallet);
	}

	return (
		<>
			{
				!session ?
				<Button className={buttonClassName} onClick={() => connect()}>
					<Typography>Connect Wallet</Typography>
				</Button> :
					<Box className={"w-full box-border"}>
						<Button
							className={cls([buttonClassName, "box-border"])}
							onClick={toggleWallet}
						>
							<Typography>Wallet</Typography>
						</Button>
						<WalletModal open={openWallet} onClose={toggleWallet} />
					</Box>
			}
		</>
	)
}