import { cryptography } from 'klayr-sdk';

function generateParams() {
	const tokenID = '1234567800000000';
	const numberOfTransfers = 20;
	const maxAmount = 100;

	const amounts = Array.from({ length: numberOfTransfers }, () =>
		BigInt(Math.floor(Math.random() * maxAmount)).toString(),
	);
	const recipients = Array.from({ length: numberOfTransfers }, () =>
		cryptography.address.getKlayr32AddressFromAddress(cryptography.utils.getRandomBytes(20)),
	);

	return JSON.stringify({ tokenID, amounts, recipients });
}

const params = generateParams();
console.log(params);
