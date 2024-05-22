import { Box, Button, Grid, IconButton, Input, InputLabel, Stack, Typography } from '@mui/material';
import { tokenActionsProps, TxsProps } from '@/components/tokens/tokenActionsModal';
import { Add, Remove } from '@mui/icons-material';
import { SubmitErrorHandler, SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { Key, useEffect, useState } from 'react';
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { useSchemas } from '@/providers/schemaProvider';
import { TransactionStatus } from '@/types/transactions';
import { createTransactionObject, returnIfString } from '@/utils/functions';
import { api } from '@/utils/api';
import { TransactionModal } from '@/components/walletConnect/transactionModal';

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
											{...register(`recipients.${index}.amount`, {required: true, pattern: /^[0-9]+$/i})}
										/>
										{errors.recipients?.[index].amount && getErrorText(returnIfString(errors.recipients?.[index].amount.type), "number")}
									</InputLabel>
									<InputLabel className={'w-full'}>
										<Typography>Address:</Typography>
										<Input
											className={'w-full'}
											type={'text'}
											placeholder={'kly address'}
											{...register(`recipients.${index}.address`, {required: true})}
										/>
										{errors.recipients?.[index].address && getErrorText(returnIfString(errors.recipients?.[index].address.type))}
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