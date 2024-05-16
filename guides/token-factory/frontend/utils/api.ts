const get = async (call: string, params?: any) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_TOKEN_FACTORY_SERVICE_URL}/api/v3/${call}`, params);

	return (await response.json())
}

const post = async (call: string, data) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_TOKEN_FACTORY_SERVICE_URL}/api/v3/${call}`, data);

	return (await response.json())
}

export const mintToken = async (tokenID: string, amount: string) => {
	try {
		const response = await post("mint", {tokenID, amount});
		return response.data;
	} catch (error) {
		console.log(error)
	}
}

export const getSchemas = async () => {
	try {
		const response = await get("schemas");
		return response.data;
	} catch (error) {
		console.log(error)
	}
}

export const getAuth = async (params: any) => {
	try {
		const response = await get("auth", params);
		return response.data;
	} catch (error) {
		console.log(error)
	}
}