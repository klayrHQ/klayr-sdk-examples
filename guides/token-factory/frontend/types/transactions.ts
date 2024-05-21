export type CommandType = "createToken" | "burn" | "mint" | "batchTransfer";

export interface ITransaction {
	id: string,
	moduleCommand: string,
	nonce: string,
	fee: string,
	minFee: string,
	size: number,
	block: {
		id: string,
		height: number,
		timestamp: number,
		isFinal: boolean
	},
	sender: {
		address: string,
		publicKey: string,
		name: string
	},
	params: any,
	executionStatus: string,
	index: number,
}
export interface ITransactionObject {
	id?: string,
	module: string,
	command: string,
	nonce: string,
	fee: string,
	senderPublicKey: string,
	signatures: string[],
	params: unknown,
}
export interface IAccount {
	chainID: string,
	publicKey: string,
	address?: string,
}
export interface IResponse {
	data: unknown,
	meta: unknown,
	links: unknown,
}
export interface INetworkFeeResponse extends IResponse {
	data: {
		transaction: {
			fee: {
				tokenID: string,
				minimum: string,
				priority: {
					low: string,
					medium: string,
					high: string,
				}
			}
		}
	},
	meta: {
		breakdown: {
			fee: {
				minimum: {
					byteFee: string,
					additionalFees: {
						validatorRegistrationFee: string,
						userAccountInitializationFee: string,
						escrowAccountInitializationFee: string,
						chainRegistrationFee: string,
						bufferBytes: string,
					}
				},
				params: any,
			}
		}
	}
}