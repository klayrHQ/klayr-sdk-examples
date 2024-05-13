import { Box, Button, Grid, Input, InputLabel, Typography } from '@mui/material';
import { tsxProps } from '@/components/tokens/tokenActionsModal';

export const Mint = ({ tokenID, tokenName }: tsxProps) => {

	return (
		<Box>
			<Typography>Mint tokens for {tokenName}</Typography>
			<form>
				<Grid container>
					<Grid item>
						<InputLabel className={'w-full'}>
							<Typography>Amount:</Typography>
							<Input
								className={'w-full'}
								type={'text'}
								placeholder={'Amount to mint'}
							/>
						</InputLabel>
					</Grid>
					<Grid item className={"flex items-end"}>
						<Button>Mint</Button>
					</Grid>
				</Grid>
			</form>
		</Box>
	)
}