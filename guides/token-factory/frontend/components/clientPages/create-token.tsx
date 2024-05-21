"use client"
import { Button, Input, InputLabel, Stack, Typography } from '@mui/material';
import { PageLayout } from '@/components/layout/pageLayout';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { createTransactionObject } from '@/utils/functions';
import { useSchemas } from '@/providers/schemaProvider';
import { returnIfString } from '@/utils/functions';
import { useEffect, useState } from 'react';
import { ITransactionObject, TransactionStatus } from '@/types/transactions';
import { TransactionModal } from '../walletConnect/transactionModal';

interface CreateTokenProps {
	name: string
	symbol: string
	totalSupply: number
}

export const CreateToken = () => {
	const { register, handleSubmit, formState: { errors } } = useForm();
	const { account, signTransaction, rpcResult } = useWalletConnect();
	const { getSchema } = useSchemas();
	const [transactionObject, setTransactionObject] = useState<ITransactionObject>();
	const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);
	const [transactionModalType, setTransactionModalType] = useState<"approve" | "status">("status");
	const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(TransactionStatus.PENDING);

	const onSubmit: SubmitHandler<CreateTokenProps> = (data) => {
		console.log(data);

		if(account) {
			const { chainID, publicKey } = account;
			const schema = getSchema(false, "tokenFactory:createToken")

			createTransactionObject("createToken", account, data)
				.then(({ transactionObject: rawTx, }) => {
					console.log('transaction: ', rawTx);
					/*setTransactionObject(rawTx);
					setFeeTokenID(_feeTokenID);*/

					signTransaction(chainID, publicKey, schema, rawTx);
					setTransactionModalType("approve")
					setOpenTransactionModal(true);
				})
				.catch(error => {
					console.log(error)
				});
		}
	}

	/* useEffect(() => {
		if (rpcResult && rpcResult.valid) {
		  setOpenApproveTransactionModal(true);
		}
	}, [rpcResult]); */

	//submit signed transaction
	const onConfirmApproval = () => {
		if (rpcResult?.result) {
		  console.log(rpcResult.result);
		}
	  };
	  
	/*useEffect(() => {
		if (submitedTransaction) {
		  setTransactionStatus(TransactionStatus.SUCCESS);
		  setOpenTransactionStatusModal(true);
		}
		if (transactionError.error) {
		  setTransactionStatus(TransactionStatus.FAILURE);
		  setOpenTransactionStatusModal(true);
		}
		setOpenApproveTransactionModal(false);
	  }, [submitedTransaction, transactionError]);*/

	const onError: SubmitErrorHandler<CreateTokenProps> = (errors) => console.log(errors);

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
		<PageLayout title={"Create Token"} subTitle={"Create your own token"}>
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
			<TransactionModal modalType={"approve"} type={"createToken"} open={openTransactionModal} onClose={() => setOpenTransactionModal(false)} onApprove={onConfirmApproval} />
		</PageLayout>
	)
}