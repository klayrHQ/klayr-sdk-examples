import { Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
import Logo from "@/assets/images/logo.png";
import Link from 'next/link';
import { ConnectWalletButton } from '@/components/walletConnect/connectWalletButton';
import { ThemeSwitcher } from '@/components/themeSwitcher';


export const Header = () => {
	return (
		<Box
			component={"header"}
			sx={{
				height: "100px",
				padding: "0px 20px",
				boxSizing: "border-box",
				backgroundColor: "darkBlue.main",
			}}
		>
			<Grid
				container
				sx={{
					height: "100%",
				}}
				justifyContent={"space-between"}
			>
				<Grid item sx={{display: "flex", alignItems: "center"}}>
					<Link href={"/"} style={{display: "flex", gap: "1rem"}}>
						<img alt={"Klayr Logo"} src={Logo.src} style={{height: "50px"}}/>
						<Typography component={"span"} variant={"h1"} color={"white"} sx={{position: "relative", top: "6px"}}>Token Factory</Typography>
					</Link>
				</Grid>
				<Grid item sx={{display: "flex", alignItems: "center"}}>
					<nav>
						<ul style={{display: "flex", alignItems: "center", gap: "1rem", color: "white"}}>
							<MenuItem>Create Token</MenuItem>
							<MenuItem>Send tx</MenuItem>
							<MenuItem><Link href={"/owned-tokens"}>Owned tokens</Link></MenuItem>
							<MenuItem><Link href={"/chain-tokens"}>Chain tokens</Link></MenuItem>
							<ConnectWalletButton />
							<ThemeSwitcher />
						</ul>
					</nav>
				</Grid>
			</Grid>
		</Box>
	)
}