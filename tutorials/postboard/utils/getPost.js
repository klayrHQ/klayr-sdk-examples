const { apiClient } = require('@liskhq/lisk-client');
let clientCache;
const nodeAPIURL = 'ws://localhost:8080/ws';

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

getClient().then((client) => {
	client.invoke("post:getPost", {
		id: "5a314502fd7647be49b594ead9057426198ebabb8380b128596816bf7cfa5653"
		// id: "9ee0e2d8d50003ed3ed3eba5c6bb9a1d1f332a7d6e924827887ac5244680588e"
	}).then(res => {
		console.log(res);
		// console.log(res.replies[0].author);
/*		const accObject = client.account.decode(res);
		const accJSON = client.account.toJSON(accObject);
		console.log(accJSON); */
	});
});