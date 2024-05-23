import { CommandType, IAccount, ITransactionObject, TransactionStatus } from '@/types/transactions';
import { api, getAuth } from '@/utils/api';

export const createTransactionObject = async (command: CommandType, account: IAccount, params: any): Promise<{
	transactionObject: ITransactionObject
}> => {
	try {
		const { address, publicKey } = account;

		let authResponse;

		if (address) {
			authResponse = await getAuth(address);
		}

		const transaction = {
			module: "tokenFactory",
			command,
			fee: '10000000',
			nonce: authResponse?.data?.nonce || 0,
			senderPublicKey: publicKey,
			signatures: [],
			params
		};

		return {
			transactionObject: {
				...transaction,
			}
		};
	} catch (error: any) {
		throw new Error(error);
	}
};

//submit signed transaction
export const onConfirmApproval = (
	rpcResult: any,
	setTransactionStatus: (status: TransactionStatus) => void,
	setTransactionModalType: (type: "status" | "approve") => void,
) => {
	if (rpcResult?.result) {
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
				//console.log(error)
			})
	}
};