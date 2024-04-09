import { Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
import Logo from "../logo.png";
import { Link } from 'react-router-dom';


export const Header = () => {
	return (
		<Box
			component={"header"}
			sx={{
				height: "100px",
				padding: "0px 20px",
				boxSizing: "border-box",
				backgroundColor: (theme) => theme.palette.darkBlue.main,
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
					<Link to={"/"} style={{display: "flex", gap: "1rem"}}>
						<img alt={"Klayr Logo"} src={Logo} style={{height: "50px"}}/>
						<Typography component={"span"} variant={"h1"} color={"white"} sx={{position: "relative", top: "6px"}}>Token Factory</Typography>
					</Link>
				</Grid>
				<Grid item sx={{display: "flex", alignItems: "center"}}>
					<nav>
						<ul style={{display: "flex", alignItems: "center", gap: "1rem", color: "white"}}>
							<MenuItem><Link to={"/wallet-connect"}>Connect Wallet</Link></MenuItem>
							<MenuItem>Create Token</MenuItem>
							<MenuItem>Send tx</MenuItem>
							<MenuItem>Owned tokens</MenuItem>
							<MenuItem>All tokens</MenuItem>
						</ul>
					</nav>
				</Grid>
			</Grid>
		</Box>
	)
}