import { getAuth } from '@/utils/api';
import { CommandType, IAccount, ITransactionObject } from '@/types/transactions';
import { Typography } from '@mui/material';

export const returnIfString = (value: unknown) => {
	if (typeof value !== "string") return undefined;
	else return value;
}

export const cls = (classes: Array<undefined | null | boolean | string>) => classes.filter(Boolean).join(" ");

export const createTransactionObject = async (command: CommandType, account: IAccount, params: any): Promise<{
	//feeTokenID: string,
	transactionObject: ITransactionObject
}> => {
	try {
		const { address, publicKey } = account;

		const authResponse = await getAuth(address);
		console.log(authResponse);

		const transaction = {
			module: "tokenFactory",
			command,
			fee: '150000',
			nonce: authResponse.data.nonce || 0,
			senderPublicKey: publicKey,
			signatures: [],
			params
		};

		return {
			transactionObject: {
				...transaction,
				//fee: '2000000000',
			}
		};
	} catch (error: any) {
		console.log(error)
		throw new Error(error);
	}
};

export const getErrorText = (errorType: string | undefined, fieldType?: string | undefined) => {
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