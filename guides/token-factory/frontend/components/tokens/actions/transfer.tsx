"use client"
import { Button, Grid, Input, InputLabel, Stack, Typography } from '@mui/material';
import { ITokenActionsProps, ITransactionFormProps } from '@/types/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { useSchemas } from '@/providers/schemaProvider';
import { useEffect, useState } from 'react';
import { TransactionStatus } from '@/types/transactions';
import { getErrorText, onError, returnIfString } from '@/utils/functions';
import { TransactionModal } from '@/components/walletConnect/transactionModal';
import { createTransactionObject, onConfirmApproval } from '@/utils/transactionFunctions';

export const Transfer = ({ tokenID, tokenName }: ITokenActionsProps) => {
	const { register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: {
			tokenID,
			recipients: [
				{
					amount: "",
					recipient: "",
				},
			],
		}
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

	return (
		<Stack className={"gap-8 min-h-full"}>
			<Typography variant={"h2"}>Transfer {tokenName} to 1 address</Typography>
			<form>
				<Grid className={"gap-4"} container>
					<Grid item>
						<InputLabel className={'w-full'}>
							<Typography>Amount:</Typography>
							<Input
								className={'w-full'}
								type={'text'}
								placeholder={'Amount to transfer'}
								{...register("recipients.0.amount", {required: true, pattern: /^[0-9]+$/i})}
							/>
							{errors?.recipients?.[0]?.amount && getErrorText(returnIfString(errors.recipients?.[0].amount.type), "number")}
						</InputLabel>
					</Grid>
					<Grid item>
						<InputLabel className={'w-full'}>
							<Typography>Address:</Typography>
							<Input
								className={'w-full'}
								type={'text'}
								placeholder={'kly address'}
								{...register("recipients.0.recipient", {required: true})}
							/>
							{errors?.recipients?.[0]?.recipient && getErrorText(returnIfString(errors.recipients?.[0].recipient.type))}
						</InputLabel>
					</Grid>
					<Grid item className={'flex items-end'}>
						<Button variant={"input"} onClick={handleSubmit(onSubmit, onError)}>
							<Typography>Send</Typography>
						</Button>
					</Grid>
				</Grid>
			</form>
			<TransactionModal
				modalType={transactionModalType}
				type={"batchTransfer"}
				open={openTransactionModal}
				onClose={() => setOpenTransactionModal(false)}
				onApprove={() => onConfirmApproval(rpcResult, setTransactionStatus, setTransactionModalType)}
				status={transactionStatus}
			/>
		</Stack>
	)
}