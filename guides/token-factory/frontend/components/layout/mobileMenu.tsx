"use client"
import { Box, Collapse, IconButton, MenuItem, Modal, Slide, Typography } from '@mui/material';
import Link from 'next/link';
import { ConnectWalletButton } from '@/components/walletConnect/connectWalletButton';
import { ThemeSwitcher } from '@/components/themeSwitcher';
import { Menu } from '@mui/icons-material';
import { useState } from 'react';
import { cls } from '@/utils/functions';

export const MobileMenu = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	}

	return (
		<Box className={"lg:hidden"}>
			<IconButton onClick={toggleMenu}>
				<Menu className={"text-white"} />
			</IconButton>
			<Modal open={menuOpen} onClose={toggleMenu} closeAfterTransition>
				<Slide direction={"left"} in={menuOpen}>
					<Box
						className={cls([
							'absolute top-0 right-0',
							'h-screen w-[300px] md:w-1/2',
							"overflow-y-auto p-4 "
						])}
						sx={{ backgroundColor: 'background.default' }}
					>
						<nav>
							<ul className={'flex flex-col items-start gap-2'}>
								<Typography className={'pl-3 pr-0 py-4 flex justify-between w-full'}>Theme mode<ThemeSwitcher
									className={'mx-4'} /></Typography>
								<ConnectWalletButton buttonClassName={'w-[90%] mx-3 my-2'} />
								<MenuItem><Link href={'/create-token'}>Create Token</Link></MenuItem>
								<MenuItem><Link href={'/owned-tokens'}>Owned tokens</Link></MenuItem>
								<MenuItem><Link href={'/chain-tokens'}>Chain tokens</Link></MenuItem>
							</ul>
						</nav>
					</Box>
				</Slide>
			</Modal>
		</Box>
	)
}