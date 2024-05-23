import { Box, Button, Grid, IconButton, Input, InputLabel, Stack, Typography } from '@mui/material';
import { tokenActionsProps, TxsProps } from '@/components/tokens/tokenActionsModal';
import { Add, Remove } from '@mui/icons-material';
import { SubmitErrorHandler, SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { Key } from 'react';

export const BatchTransfer = ({ tokenID, tokenName }: tokenActionsProps) => {
	const { register, handleSubmit, control, formState: { errors } } = useForm({
		defaultValues: {
			tokenID,
			recipients: [
				{
					amount: '',
					address: '',
				},
			],
		},
	});

	const onSubmit: SubmitHandler<TxsProps> = (data) => console.log(data);
	const onError: SubmitErrorHandler<TxsProps> = (errors) => console.log(errors);

	const { fields, append, remove } = useFieldArray({
		name: 'recipients',
		control,
	});

	return (
		<Stack className={'gap-8 min-h-full'}>
			<Typography variant={'h2'}>Transfer {tokenName} to multiple addresses</Typography>
			<form>
				<Stack className={'gap-6'}>
					{
						fields.map((field: { id: Key | null | undefined; }, index: number) => (
							<Box key={field.id} className={'flex gap-4'} container>
								<Box className={'flex gap-4 grow'}>
									<InputLabel className={'w-full'}>
										<Typography>Amount:</Typography>
										<Input
											className={'w-full'}
											type={'text'}
											placeholder={'Amount to transfer'}
											{...register(`recipients.${index}.amount`, {required: true})}
										/>
									</InputLabel>
									<InputLabel className={'w-full'}>
										<Typography>Address:</Typography>
										<Input
											className={'w-full'}
											type={'text'}
											placeholder={'kly address'}
											{...register(`recipients.${index}.address`, {required: true})}
										/>
									</InputLabel>
								</Box>
								<Stack className={'justify-between h-[60px] mt-auto'}>
									{
										fields.length > 1 &&
										<IconButton onClick={() => remove(index)}>
											<Remove className={'text-[16px]'} />
										</IconButton>
									}
									<IconButton className={"mt-auto"} onClick={() => append({amount: "", address: ""})}>
										<Add className={'text-[16px]'} />
									</IconButton>
								</Stack>
							</Box>
						))
					}
					<Button variant={"input"} onClick={handleSubmit(onSubmit, onError)}>
						<Typography>Send</Typography>
					</Button>
				</Stack>
			</form>
		</Stack>
	)
}