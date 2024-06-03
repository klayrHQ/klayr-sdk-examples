import { cryptography } from 'klayr-sdk';

function generateParams() {
	const tokenID = '0123456700000000';
	const numberOfTransfers = 20;
	const maxAmount = 100;

	const recipients = Array.from({ length: numberOfTransfers }, () => ({
		recipient: cryptography.address.getKlayr32AddressFromAddress(
			cryptography.utils.getRandomBytes(20),
		),
		amount: BigInt(Math.floor(Math.random() * maxAmount)).toString(),
	}));

	return JSON.stringify({ tokenID, recipients });
}

const params = generateParams();
console.log(params);
