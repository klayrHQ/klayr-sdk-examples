"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { WalletConnectModal } from '@walletconnect/modal';
import WCClient, {SignClient} from '@walletconnect/sign-client';
import Logo from '@/assets/images/logo.png';
import { SessionTypes } from '@walletconnect/types';
import { getKlayr32AddressFromPublicKey } from '@/utils/chainFunctions';
import { chains, currentChain, projectID, recipientChainID } from '@/utils/constants';
import { useSchemas } from '@/providers/schemaProvider';
import { codec } from '@klayr/codec';
import { IAccount } from '@/types/transactions';

type TRpcRequestCallback = (chainId: string, address: string, schema: any, rawTx: any) => Promise<void>;

interface WalletConnectProps {
	session: any
	connect: () => void
	disconnect: () => void
	account: IAccount | undefined
	//signTransaction: (payload, schema) => void
	signTransaction: TRpcRequestCallback
	rpcResult: IFormattedRpcResponse | null
}

type TransactionResult = {
	module?: string;
	command?: string;
	nonce?: string;
	fee?: string;
	senderPublicKey?: string;
	params?: any;
	signatures?: string[];
	error?: { code: number; message: string };
};

interface IFormattedRpcResponse {
	method?: string;
	address?: string;
	valid: boolean;
	result: string;
}

export const WalletConnect = createContext<WalletConnectProps>(
	{} as WalletConnectProps,
);

export const useWalletConnect = () => useContext(WalletConnect);

export const WalletConnectProvider = ({ children }: {
	children: ReactNode;
}) => {
	const { schemas, getSchema } = useSchemas()
	const [session, setSession] = useState<any>()
	const [signClient, setSignClient] = useState<WCClient>();
	const [topic, setTopic] = useState<string | undefined>();
	const [account, setAccount] = useState<IAccount>()
	const [pending, setPending] = useState(false);
	const [result, setResult] = useState<IFormattedRpcResponse | null>(null);

	const baseTransactionSchema = getSchema(true);

	const modal = new WalletConnectModal({
		projectId: projectID,
		chains: chains,
		themeVariables: {
			"--wcm-accent-color": "rgb(13, 117, 253)",
			"--wcm-background-color": "rgb(13, 117, 253)",
			"--wcm-overlay-backdrop-filter": "opacity(50%)",
		},
	})

	useEffect(() => {
		const getSignClient = async () => {
			const signClient = await SignClient.init({
				projectId: projectID,
				// optional parameters
				// relayUrl: relayUrl,
				metadata: {
					name: 'Token Factory',
					description: 'Klayr Token Factory',
					url: '#',
					icons: [Logo.src],
				}
			})

			setSignClient(signClient)
		}

		if (!signClient) {
			getSignClient()
		} else if (
			signClient &&
			!session &&
			signClient.session.getAll().length > 0
		) {
			const lastSessionIndex = signClient.session.getAll().length - 1;
			const session = signClient.session.getAll()[lastSessionIndex];
			setSession(session);
		}

		if (signClient) {
			// @ts-ignore
			/*signClient.on("session_event", (event) => {
				// console.log("event", event);
				// Handle session events, such as "chainChanged", "accountsChanged", etc.
			});*/

			// @ts-ignore
			/*signClient.on("session_update", ({ topic, params, }) => {
				const { namespaces, } = params;
				const _session = signClient.session.get(topic);
				// Overwrite the `namespaces` of the existing session with the incoming one.
				const updatedSession = { ..._session, namespaces, };
				// Integrate the updated session state into your dapp state.
				// console.log("update", topic, params, updatedSession);
				// onSessionUpdate(updatedSession)
			});*/

			signClient.on("session_delete", () => {
				setSession(undefined);
			});
		}
	}, [signClient, session])

	useEffect(() => {
		if (session) {
			(async () => {
				setTopic(session.topic);
				const publicKey = session.namespaces.klayr.accounts[0].split(":")[2];
				const address = await getKlayr32AddressFromPublicKey(
					Buffer.from(publicKey, "hex"),
				);
				setAccount({chainID: currentChain, address, publicKey});
			})();
		}
	}, [session]);

	async function getUri(): Promise<{
		uri?: string | undefined;
		approval?: () => Promise<SessionTypes.Struct>;
	}> {
		if (!signClient) return {uri: undefined, approval: undefined,};
		return signClient.connect({
			// pairingTopic: topic,
			requiredNamespaces: {
				klayr: {
					methods: ["sign_transaction"],
					chains: chains,
					events: [
						"session_proposal",
						"session_request",
						"session_update",
						"session_ping",
						"session_event",
						"session_delete",
					],
				},
			},
		});
	}

	async function connect() {
		try {
			const {uri, approval,} = await getUri();
			if (uri && approval) {
				await modal.openModal({
					uri,
				});
				const session = await approval();
				setSession(session);
				modal.closeModal();
			}
		} catch (e) {
			console.error(e);
			modal.closeModal();
		}
	}

	async function disconnect() {
		if (!signClient) return;
		try {
			if (topic) {
				await signClient.disconnect({
					topic,
					reason: {
						code: 0,
						message: "User disconnected",
					},
				});
				setSession(undefined);
				setTopic(undefined);
				setAccount(undefined);
			}
		} catch (e) {
			// console.error(e);
		}
	}

	const encodeTransaction = async (tx: any, paramsSchema: any) => {
		let encodedParams;
		if (!Buffer.isBuffer(tx.params)) {
			encodedParams = paramsSchema ? codec.encode(paramsSchema, tx.params) : Buffer.alloc(0);
		} else {
			encodedParams = tx.params;
		}

		// @ts-ignore
		const encodedTransaction = codec.encode(baseTransactionSchema, {
			...tx,
			params: encodedParams,
		});

		return encodedTransaction;
	};

	const fromTransactionJSON = async (rawTx: any, paramsSchema: any) => {
		// @ts-ignore
		const tx = codec.fromJSON(baseTransactionSchema, {
			...rawTx,
			params: '',
		});

		let params;
		if (typeof rawTx.params === 'string') {
			params = paramsSchema ? codec.decode(paramsSchema, Buffer.from(rawTx.params, 'hex')) : {};
		} else {
			params = paramsSchema ? codec.fromJSON(paramsSchema, rawTx.params) : {};
		}

		return {
			...tx,
			id: rawTx.id ? Buffer.from(rawTx.id, 'hex') : Buffer.alloc(0),
			params,
		};
	};

	const _createJsonRpcRequestHandler =
		(rpcRequest: (chainId: string, address: string, schema: any, rawTx: any) => Promise<IFormattedRpcResponse>) =>
			async (chainId: string, address: string, schema: any, rawTx: any) => {
				if (typeof signClient === 'undefined') {
					throw new Error('WalletConnect is not initialized');
				}
				if (typeof session === 'undefined') {
					throw new Error('Session is not connected');
				}

				try {
					setPending(true);
					const result = await rpcRequest(chainId, address, schema, rawTx);
					setResult(result);
				} catch (err: any) {
					console.error('RPC request failed: ', err);
					setResult({
						address,
						valid: false,
						result: err?.message ?? err,
					});
					throw new Error(err);
				} finally {
					setPending(false);
				}
			};

	const signTransaction = _createJsonRpcRequestHandler(
		async (chainId: string, address: string, schema: any, rawTx: any): Promise<IFormattedRpcResponse> => {
			const tx = await fromTransactionJSON(rawTx, schema);
			const binary = await encodeTransaction(tx, schema);
			const payload = binary.toString('hex');

			try {
				const result = await signClient!.request({
					chainId,
					topic: session!.topic,
					request: {
						method: "sign_transaction",
						params: {
							payload,
							schema,
							recipientChainID: recipientChainID,
						},
					},
				});

				const valid = true;

				rawTx.signatures = [...JSON.parse(result).signatures];

				const _tx = await fromTransactionJSON(rawTx, schema);
				const _binary = await encodeTransaction(_tx, schema);
				const _signedTransaction = _binary.toString('hex');

				return {
					method: "sign_transaction",
					address,
					valid,
					result: _signedTransaction,
				};
			} catch (error: any) {
				throw new Error(error);
			}
		},
	)

	/*async function signTransaction(schema, payload) {
		try {
			if (!signClient || !session || !publicKey) {
				console.error("Prerequisites not met");
				return;
			}
			const responseJSON = await signClient.request({
				topic: session.topic,
				chainId: currentChain,
				request: {
					method: "sign_transaction",
					params: {
						address: publicKey,
						payload,
						schema: schema || getSchema(true),
					},
				},
			}) as string;

			const result = JSON.parse(responseJSON) as TransactionResult;

			if (result && result.error) {
				console.error("ERROR");
				console.log("Transaction failed");
			}
			if (result && result.signatures) {
				console.log("RESULT", result);
			}
		} catch (e) {
			console.error(e, "ERROR");
		}
	}*/

	return (
		<WalletConnect.Provider
			value={{
				session,
				connect,
				disconnect,
				account,
				rpcResult: result,
				signTransaction,
			}}
		>
			{children}
		</WalletConnect.Provider>
	)

};