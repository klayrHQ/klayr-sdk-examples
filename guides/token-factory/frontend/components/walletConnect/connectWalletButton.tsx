"use client"
import { Box, Button } from '@mui/material';
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { WalletPopover } from '@/components/walletConnect/walletPopover';
import { useRef, useState } from 'react';

export const ConnectWalletButton = () => {
	const { connect, session } = useWalletConnect()
	const [openPopover, setOpenPopover] = useState(false)
	const anchor = useRef();

	return (
		<>
			{
				!session ?
				<Button className={"w-max mx-auto"} onClick={() => connect()}>
					Connect Wallet
				</Button> :
					<Box>
						<Button
							className={"w-max mx-auto"}
							ref={anchor}
							onClick={() => setOpenPopover(!openPopover)}
						>
							Wallet
						</Button>
						<WalletPopover anchorEl={anchor.current} open={openPopover} onClose={() => setOpenPopover(false)} />
					</Box>
			}
		</>
	)
}