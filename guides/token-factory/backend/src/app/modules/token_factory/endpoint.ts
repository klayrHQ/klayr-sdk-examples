import { validator } from '@klayr/validator';
import { BaseEndpoint, JSONObject, ModuleEndpointContext, cryptography } from 'klayr-sdk';
import { getTokenInfoSchema } from './schemas';
import { TokenStore } from './stores/token';
import { TokenID, TokenInfoData } from './types';
import { OwnerStore } from './stores/owner';

export class TokenFactoryEndpoint extends BaseEndpoint {
	public init() {}

	public async getTokenInfo(context: ModuleEndpointContext): Promise<JSONObject<TokenInfoData>> {
		const { params } = context;
		validator.validate<{ tokenID: TokenID }>(getTokenInfoSchema, params);

		const tokenStore = this.stores.get(TokenStore);
		const ownerStore = this.stores.get(OwnerStore);
		const [tokenInfo, owner] = await Promise.all([
			tokenStore.get(context, params.tokenID),
			ownerStore.get(context, params.tokenID),
		]);

		return {
			name: tokenInfo.name,
			symbol: tokenInfo.symbol,
			totalSupply: tokenInfo.totalSupply.toString(),
			owner: cryptography.address.getKlayr32AddressFromAddress(owner.address),
		};
	}
}
