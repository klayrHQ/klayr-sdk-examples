import { Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
import Logo from "@/assets/images/logo.png";
import Link from 'next/link';
import { ConnectWalletButton } from '@/components/walletConnect/connectWalletButton';
import { ThemeSwitcher } from '@/components/themeSwitcher';
import { MobileMenu } from '@/components/layout/mobileMenu';


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
						<img className={"h-[40px] md:h-[50px]"} alt={"Klayr Logo"} src={Logo.src}/>
						<Typography
							className={"relative top-[6px] text-2xl lg:text-3xl lg:mt-1"}
							component={"span"}
							variant={"h1"}
							color={"white"}
						>
							Token Factory
						</Typography>
					</Link>
				</Grid>
				<Grid className={"flex items-center"} item>
					<nav className={"hidden lg:block"}>
						<ul className={"flex items-center gap-2 text-white"}>
							<MenuItem><Link href={"/create-token"}>Create Token</Link></MenuItem>
							<MenuItem><Link href={"/owned-tokens"}>Owned tokens</Link></MenuItem>
							<MenuItem><Link href={"/chain-tokens"}>Chain tokens</Link></MenuItem>
							<ConnectWalletButton />
							<ThemeSwitcher className={"mx-4"} />
						</ul>
					</nav>
					<MobileMenu />
				</Grid>
			</Grid>
		</Box>
	)
}