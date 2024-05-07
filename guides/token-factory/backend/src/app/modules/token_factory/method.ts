import { BaseMethod, CommandVerifyContext } from 'klayr-sdk';
import { OwnerStore, OwnerStoreData } from './stores/owner';

export class TokenFactoryMethod extends BaseMethod {
	public async getOwnerOfToken<T>(
		context: CommandVerifyContext<T>,
		tokenID: Buffer,
	): Promise<OwnerStoreData | undefined> {
		try {
			const ownerStore = this.stores.get(OwnerStore);
			return await ownerStore.get(context, tokenID);
		} catch {
			return undefined;
		}
	}
}
