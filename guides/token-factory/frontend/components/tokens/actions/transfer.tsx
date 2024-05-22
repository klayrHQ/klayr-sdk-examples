import { Button, Grid, Input, InputLabel, Stack, Typography } from '@mui/material';
import { tokenActionsProps, TxsProps } from '@/components/tokens/tokenActionsModal';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { useSchemas } from '@/providers/schemaProvider';
import { useEffect, useState } from 'react';
import { TransactionStatus } from '@/types/transactions';
import { createTransactionObject, returnIfString } from '@/utils/functions';
import { api } from '@/utils/api';
import { TransactionModal } from '@/components/walletConnect/transactionModal';

export const Transfer = ({ tokenID, tokenName }: tokenActionsProps) => {
	const { register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: {
			tokenID,
			recipients: [
				{
					amount: "",
					address: "",
				},
			],
		}
	});
	const { account, signTransaction, rpcResult } = useWalletConnect();
	const { getSchema } = useSchemas();
	const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);
	const [transactionModalType, setTransactionModalType] = useState<"approve" | "status">("status");
	const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(TransactionStatus.PENDING);

	const onSubmit: SubmitHandler<TxsProps> = (data) => {
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
					console.log(error)
				});
		}
	}

	useEffect(() => {
		if (rpcResult && rpcResult.valid) {
			setTransactionModalType("approve");
			if (!openTransactionModal) setOpenTransactionModal(true);
		}
	}, [rpcResult]);

	//submit signed transaction
	const onConfirmApproval = () => {
		if (rpcResult?.result) {
			console.log(rpcResult)
			api.post("transactions", { transaction: rpcResult.result })
				.then(r => {
					if(r.error) {
						setTransactionStatus(TransactionStatus.FAILURE);
						setTransactionModalType("status");
					}
					else {
						setTransactionStatus(TransactionStatus.SUCCESS);
						setTransactionModalType('status');
					}
				})
				.catch(error => {
					console.log(error)
				})
		}
	};

	const onError: SubmitErrorHandler<TxsProps> = (errors) => console.log(errors);

	const getErrorText = (errorType: string | undefined, fieldType?: string | undefined) => {
		let errorText = "Unknown input error";

		if (errorType === "required") errorText = "This field is required";

		if (errorType === "pattern") {
			if(fieldType === "number") {
				errorText = "This field only accepts numbers";
			} else {
				errorText = "Invalid input";
			}
		}

		return <Typography className={"text-xs text-[#FF422D] mt-1"}>{errorText}</Typography>;
	}

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
							{errors.recipients?.[0].amount && getErrorText(returnIfString(errors.recipients?.[0].amount.type), "number")}
						</InputLabel>
					</Grid>
					<Grid item>
						<InputLabel className={'w-full'}>
							<Typography>Address:</Typography>
							<Input
								className={'w-full'}
								type={'text'}
								placeholder={'kly address'}
								{...register("recipients.0.address", {required: true})}
							/>
							{errors.recipients?.[0].address && getErrorText(returnIfString(errors.recipients?.[0].address.type))}
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
				onApprove={onConfirmApproval}
				status={transactionStatus}
			/>
		</Stack>
	)
}