// Chain Functions
export const DEFAULT_LISK32_ADDRESS_PREFIX = 'lsk';
export const BINARY_ADDRESS_LENGTH = 20;
export const LISK32_ADDRESS_LENGTH = 41;
export const LISK32_CHARSET = 'zxvcpmbn3465o978uyrtkqew2adsjhfg'
export const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

//WalletConnect
export const projectID = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;
export const currentChain = "lisk:01000000";
export const chains = ["lisk:01000000"];