'use client';
import { Button, Input, InputLabel, Stack, Typography } from '@mui/material';
import { PageLayout } from '@/components/layout/pageLayout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { getErrorText, onError, returnIfString } from '@/utils/functions';
import { useSchemas } from '@/providers/schemaProvider';
import { useEffect, useState } from 'react';
import { TransactionStatus } from '@/types/transactions';
import { TransactionModal } from '../components/walletConnect/transactionModal';
import { createTransactionObject, onConfirmApproval } from '@/utils/transactionFunctions';
import { ConnectWalletButton } from '@/components/walletConnect/connectWalletButton';

interface CreateTokenProps {
	name: string
	symbol: string
	totalSupply: number
}

export const CreateToken = () => {
	const { register, handleSubmit, formState: { errors } } = useForm();
	const { account, signTransaction, rpcResult } = useWalletConnect();
	const { getSchema } = useSchemas();
	const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);
	const [transactionModalType, setTransactionModalType] = useState<"approve" | "status">("status");
	const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(TransactionStatus.PENDING);

	const onSubmit: SubmitHandler<CreateTokenProps> = (data) => {
		if(account) {
			const { chainID, publicKey } = account;
			const schema = getSchema(false, "tokenFactory:createToken")

			createTransactionObject("createToken", account, data)
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
		<PageLayout title={"Create Token"} subTitle={"Create your own token"}>
			{
				account?.address ?
				<form className={"w-[350px] md:w-[500px]"}>
					<Stack className={"gap-4"}>
						<InputLabel className={"w-full"}>
							<Typography>Token Name:</Typography>
							<Input
								className={"w-full"}
								type={'text'}
								error={!!errors.name}
								placeholder={"Example Token"}
								{...register("name", { required: true })}
							/>
							{errors.name && getErrorText(returnIfString(errors.name.type))}
						</InputLabel>
						<InputLabel className={'w-full'}>
							<Typography>Token Symbol:</Typography>
							<Input
								className={'w-full'}
								type={'text'}
								error={!!errors.symbol}
								placeholder={"TKN"}
								{...register('symbol', { required: true })}
							/>
							{errors.symbol && getErrorText(returnIfString(errors.symbol.type))}
						</InputLabel>
						<InputLabel className={"w-full"}>
							<Typography>Total Supply:</Typography>
							<Input
								className={"w-full"}
								type={'text'}
								error={!!errors.totalSupply}
								placeholder={"10000"}
								{...register("totalSupply", { required: true, pattern: /^[0-9]+$/i })}
							/>
							{errors.totalSupply && getErrorText(returnIfString(errors.totalSupply.type), "number")}
						</InputLabel>
						{/* @ts-ignore */}
						<Button className={"mt-2"} variant={"input"} onClick={handleSubmit(onSubmit, onError)}><Typography>Submit</Typography></Button>
					</Stack>
				</form>
				: <ConnectWalletButton buttonClassName={"mx-auto"} />
			}
			<TransactionModal
				modalType={transactionModalType}
				type={"createToken"}
				open={openTransactionModal}
				onClose={() => setOpenTransactionModal(false)}
				onApprove={() => onConfirmApproval(rpcResult, setTransactionStatus, setTransactionModalType)}
				status={transactionStatus}
			/>
		</PageLayout>
	)
}