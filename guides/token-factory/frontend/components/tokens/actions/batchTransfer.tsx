"use client"
import { Box, Button, IconButton, Input, InputLabel, Stack, Typography } from '@mui/material';
import { ITokenActionsProps, ITransactionFormProps } from '@/types/types';
import { Add, Remove } from '@mui/icons-material';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { Key, useEffect, useState } from 'react';
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { useSchemas } from '@/providers/schemaProvider';
import { TransactionStatus } from '@/types/transactions';
import { getErrorText, onError, returnIfString } from '@/utils/functions';
import { TransactionModal } from '@/components/walletConnect/transactionModal';
import { createTransactionObject, onConfirmApproval } from '@/utils/transactionFunctions';

export const BatchTransfer = ({ tokenID, tokenName }: ITokenActionsProps) => {
	const { register, handleSubmit, control, formState: { errors } } = useForm({
		defaultValues: {
			tokenID,
			recipients: [
				{
					amount: '',
					recipient: '',
				},
			],
		},
	});
	const { account, signTransaction, rpcResult } = useWalletConnect();
	const { getSchema } = useSchemas();
	const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);
	const [transactionModalType, setTransactionModalType] = useState<"approve" | "status">("status");
	const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(TransactionStatus.PENDING);

	const onSubmit: SubmitHandler<ITransactionFormProps> = (data) => {
		if(account) {
			const { chainID, publicKey } = account;
			const schema = getSchema(false, "tokenFactory:batchTransfer")

			createTransactionObject("batchTransfer", account, data)
				.then(({ transactionObject: rawTx, }) => {
					//console.log('transaction: ', rawTx);
					signTransaction(chainID, publicKey, schema, rawTx);
					setTransactionModalType("status")
					setOpenTransactionModal(true);
				})
				.catch(error => {
					//console.log(error)
				});
		}
	}

	useEffect(() => {
		if (rpcResult && rpcResult.valid) {
			setTransactionModalType("approve");
			if (!openTransactionModal) setOpenTransactionModal(true);
		}
	}, [rpcResult]);

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
							<Box key={field.id} className={'flex gap-4'}>
								<Box className={'flex gap-4 grow'}>
									<InputLabel className={'w-full'}>
										<Typography>Amount:</Typography>
										<Input
											className={'w-full'}
											type={'text'}
											placeholder={'Amount to transfer'}
											{...register(`recipients.${index}.amount`, {required: true, pattern: /^[0-9]+$/i})}
										/>
										{errors?.recipients?.[index]?.amount && getErrorText(returnIfString(errors?.recipients?.[index]?.amount?.type), "number")}
									</InputLabel>
									<InputLabel className={'w-full'}>
										<Typography>Address:</Typography>
										<Input
											className={'w-full'}
											type={'text'}
											placeholder={'kly address'}
											{...register(`recipients.${index}.recipient`, {required: true})}
										/>
										{errors?.recipients?.[index]?.recipient && getErrorText(returnIfString(errors?.recipients?.[index]?.recipient?.type))}
									</InputLabel>
								</Box>
								<Stack className={'justify-between h-[60px] mt-auto'}>
									{
										fields.length > 1 &&
										<IconButton onClick={() => remove(index)}>
											<Remove className={'text-[16px]'} />
										</IconButton>
									}
									<IconButton className={"mt-auto"} onClick={() => append({amount: "", recipient: ""})}>
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
			<TransactionModal
				modalType={transactionModalType}
				type={"batchTransfer"}
				open={openTransactionModal}
				onClose={() => setOpenTransactionModal(false)}
				onApprove={() => onConfirmApproval(rpcResult, setTransactionStatus, setTransactionModalType,)}
				status={transactionStatus}
			/>
		</Stack>
	)
}