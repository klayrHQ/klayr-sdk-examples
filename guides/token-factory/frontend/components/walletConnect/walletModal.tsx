"use client"
import { Button, Modal, ModalProps, Popover, PopoverProps, Slide, Stack, Typography } from '@mui/material';
import { useWalletConnect } from '@/providers/walletConnectProvider';

export const WalletModal = ({open, onClose}: {open: ModalProps["open"], onClose: ModalProps["onClose"]}) => {
	const { account, disconnect } = useWalletConnect()

	return (
		<Modal
			closeAfterTransition
			open={open}
			onClose={onClose}
			component={"div"}
		>
			<Slide direction={"left"} in={open}>
				<Stack
					className={'absolute top-0 right-0 p-8 w-[350px] h-full gap-6'}
					sx={{backgroundColor: "background.default"}}
				>
					<Typography variant={"h2"}>
						Connected Wallet
					</Typography>
					<Stack className={'gap-1'}>
						<Typography>Wallet address:</Typography>
						<Typography title={account?.address}>{account?.address?.substring(0, 20)}...</Typography>
					</Stack>
					<Button onClick={disconnect}><Typography>Disconnect</Typography></Button>
				</Stack>
			</Slide>
		</Modal>
	)
}