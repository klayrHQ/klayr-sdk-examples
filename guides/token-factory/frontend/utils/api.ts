import { IToken } from '@/types/types';

const get = async (call: string, params?: any) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_TOKEN_FACTORY_SERVICE_URL}/api/v3/${call}`, params);

	return (await response.json())
}

const post = async (call: string, data: any) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_TOKEN_FACTORY_SERVICE_URL}/api/v3/${call}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}
	);

	return (await response.json())
}

const getFromCore = async (data?: any) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_TOKEN_FACTORY_CORE_URL}/rpc`,
		{
			method: "POST",
			body: JSON.stringify(data),
		}
	);

	return (await response.json())
}

export const api = {
	get,
	getFromCore,
	post
}

export const mintToken = async (tokenID: string, amount: string) => {
	try {
		const response = await post("mint", {tokenID, amount});
		return response.data;
	} catch (error) {
		// console.log(error)
	}
}

export const getSchemas = async () => {
	try {
		const response = await get("schemas");
		return response.data;
	} catch (error) {
		// console.log(error)
	}
}

export const getAuth = async (address: string) => {
	try {
		const response = await get(`auth?address=${address}`);
		return response;
	} catch (error) {
		// console.log(error)
	}
}

export const getTokens = async (address?: string) => {
	try {
		if(address) {
			const response = await getFromCore( {
				jsonrpc: "2.0",
				id: "1",
				method: "tokenFactoryInfo_getTokenList",
				params: { address }
			});
			return response.result as IToken[]
		}

		const response = await getFromCore( {
			jsonrpc: "2.0",
			id: "1",
			method: "tokenFactoryInfo_getTokenList",
			params: {}
		});
		return response.result as IToken[]
	} catch (error) {
		console.log(error)
	}
}