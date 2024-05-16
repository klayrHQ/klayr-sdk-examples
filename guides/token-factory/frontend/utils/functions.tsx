import { getAuth } from '@/utils/api';

export const cls = (classes: Array<undefined | null | boolean | string>) => classes.filter(Boolean).join(" ");

/*
export const createTransactionObject = async <T>(module: TransactionModule, command: string, account: IAccount, params: T): Promise<{
	feeTokenID: string,
	transactionObject: ITransactionObject
}> => {
	try {
		const { address, publicKey } = account;

		const authResponse = await getAuth({
			address,
		});

		const transaction = {
			module,
			command,
			fee: '0',
			nonce: authResponse.data.nonce || 0,
			senderPublicKey: publicKey,
			signatures: [],
			params
		};

		const networkFeeReponse: INetwrokFeeResponse = await apiGetEstimationFee({
			transaction,
		});

		return {
			feeTokenID: networkFeeReponse.data.transaction.fee.tokenID,
			transactionObject: {
				...transaction,
				fee: '2000000000',
			}
		};
	} catch (e: any) {
		if (e instanceof AxiosError)
			throw new Error(e.response?.data.message);
		throw new Error(e);
	}
};*/
