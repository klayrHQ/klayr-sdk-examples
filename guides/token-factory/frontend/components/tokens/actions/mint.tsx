import { Button, Grid, Input, InputLabel, Stack, Typography } from '@mui/material';
import { tokenActionsProps, TxsProps } from '@/components/tokens/tokenActionsModal';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';

export const Mint = ({ tokenID, tokenName }: tokenActionsProps) => {
	const { register, handleSubmit, formState: { errors } } = useForm({defaultValues: {tokenID}});

	const onSubmit: SubmitHandler<TxsProps> = (data) => console.log(data);
	const onError: SubmitErrorHandler<TxsProps> = (errors) => console.log(errors);

	return (
		<Stack className={"gap-8 min-h-full"}>
			<Typography variant={"h2"}>Mint tokens for {tokenName}</Typography>
			<form>
				<Grid className={"gap-4"} container>
					<Grid item>
						<InputLabel className={'w-full'}>
							<Typography>Amount:</Typography>
							<Input
								className={'w-full'}
								type={'text'}
								placeholder={'Amount to mint'}
								{...register("amount", {required: true})}
							/>
						</InputLabel>
					</Grid>
					<Grid item className={'flex items-end'}>
						<Button variant={"input"} onClick={handleSubmit(onSubmit, onError)}>
							<Typography>Mint</Typography>
						</Button>
					</Grid>
				</Grid>
			</form>
		</Stack>
	)
}