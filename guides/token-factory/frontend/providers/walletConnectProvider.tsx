"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { WalletConnectModal } from '@walletconnect/modal';
import WCClient, {SignClient} from '@walletconnect/sign-client';
import Logo from '@/assets/images/logo.png';
import { SessionTypes } from '@walletconnect/types';
import { getLisk32AddressFromPublicKey } from '@/utils/lisk';

interface WalletConnectProps {
	session: any
	connect: () => void
	disconnect: () => void
	address: string | undefined
	publicKey: string | undefined
	sendTransaction: () => void
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

export const WalletConnect = createContext<WalletConnectProps>(
	{} as WalletConnectProps,
);

export const useWalletConnect = () => useContext(WalletConnect)

export const WalletConnectProvider = ({ children }: {
	children: ReactNode;
}) => {
	const [session, setSession] = useState<any>()
	const [signClient, setSignClient] = useState<WCClient>();
	const [topic, setTopic] = useState<string | undefined>();
	const [address, setAddress] = useState<string | undefined>();
	const [publicKey, setPublicKey] = useState<string | undefined>();

	//const projectID = process.env.REACT_APP_WC_PROJECT_ID as string
	const projectID = "730e84c79793076a98d0f8830ce1a1a9"

	/*if(!projectID) {
		throw new Error('Please add a project id to .env');
	}*/

	const modal = new WalletConnectModal({
		projectId: projectID,
		chains: ["lisk:01000000"],
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
			signClient.on("session_event", (event) => {
				console.log("event", event);
				// Handle session events, such as "chainChanged", "accountsChanged", etc.
			});

			signClient.on("session_update", ({ topic, params, }) => {
				const { namespaces, } = params;
				const _session = signClient.session.get(topic);
				// Overwrite the `namespaces` of the existing session with the incoming one.
				const updatedSession = { ..._session, namespaces, };
				// Integrate the updated session state into your dapp state.
				console.log("update", topic, params, updatedSession);
				// onSessionUpdate(updatedSession)
			});

			signClient.on("session_delete", () => {
				console.log("Wallet initiated session delete");
				setSession(undefined);
			});
		}
	}, [signClient, session])

	useEffect(() => {
		if (session) {
			(async () => {
				setTopic(session.topic);
				const publicKey = session.namespaces.lisk.accounts[0].split(":")[2];
				const address = await getLisk32AddressFromPublicKey(
					Buffer.from(publicKey, "hex"),
				);
				setAddress(address);
				setPublicKey(publicKey);
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
				lisk: {
					methods: ["send_transaction", "sign_transaction", "sign_message"],
					chains: ["lisk:01000000"],
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
				/*setAddresses(undefined);*/
				console.log("Wallet disconnected");
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function sendTransaction() {
		try {
			if (!signClient || !session || !publicKey) {
				console.error('Prerequisites not met');
				return;
			}
			const responseJSON = await signClient.request({
				topic: session.topic,
				chainId: 'lisk:01000000',
				request: {
					method: 'send_transaction',
					params: {
						address: publicKey,
					},
				},
			}) as string;

			const result = JSON.parse(responseJSON) as TransactionResult;

			if (result && result.error) {
				console.error('ERROR');
				console.log('Transaction failed');
			}
			if (result && result.signatures) {
				console.log('RESULT', result);
			}
		} catch (e) {
			console.error(e, "ERROR");
		}
	}

	return (
		<WalletConnect.Provider
			value={{
				session,
				connect,
				disconnect,
				address,
				publicKey,
				sendTransaction,
			}}
		>
			{children}
		</WalletConnect.Provider>
	)

};