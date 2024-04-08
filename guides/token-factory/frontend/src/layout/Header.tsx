import { Box, Grid, Typography } from '@mui/material';
import Logo from "../logo.png";


export const Header = () => {
	return (
		<Box
			component={"header"}
			sx={{
				height: "100px",
				padding: "20px",
				boxSizing: "border-box",
				backgroundColor: (theme) => theme.palette.darkBlue.main,
			}}
		>
			<Grid
				container
				sx={{
					height: "100%",
				}}
			>
				<Grid item sx={{display: "flex", alignItems: "center", gap: "1rem"}}>
					<img alt={"Klayr Logo"} src={Logo} style={{height: "50px"}}/>
					<Typography component={"span"} variant={"h1"} color={"white"}>Klayr</Typography>
				</Grid>
				<Grid item>

				</Grid>
			</Grid>
		</Box>
	)
}