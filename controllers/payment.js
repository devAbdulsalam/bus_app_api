import getToken from '../utils/monnify.js';

export const createPayment = async (req, res) => {
	const { customerName, customerEmail, amount } = req.body;

	const accessToken = await getToken();
	// console.log('accessToken', accessToken);
	try {
		const response = await fetch(
			'https://sandbox.monnify.com/api/v1/merchant/transactions/init-transaction',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					amount,
					customerName,
					customerEmail,
					paymentReference: `ref_${Date.now()}`,
					paymentDescription: 'Payment for goods',
					currencyCode: 'NGN',
					contractCode: 8794558373,
					redirectUrl: 'https://my-merchants-page.com/transaction/confirm',
				}),
			}
		);

		const data = await response.json();
		console.log(data);
		res.json({ paymentUrl: data?.responseBody?.checkoutUrl });
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ error: error?.message || error?.responseMessage || error });
	}
};

export const confrimTransaction = async (req, res) => {
	const { paymentReference } = req.body;
	try {
		const accessToken = await getToken();

		// paymentReference = reference12345;

		const response = await fetch(
			`https://sandbox.monnify.com/api/v1/merchant/transactions/query?paymentReference=${paymentReference}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error('Error confirming transaction:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const getPayment = async (req, res) => {
	const { id } = req.params;
	try {
		const accessToken = await getToken();
		// MNFY | 20190809123429 | 000000;

		const response = await fetch(
			`https://sandbox.monnify.com/api/v1/merchant/transactions/query??transactionReference=${id}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error('Error confirming transaction:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const getPayments = async (req, res) => {
	try {
		const accessToken = await getToken();

		const response = await fetch(
			`https://https://sandbox.monnify.com/api/v1/transactions/search`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error('Error getting transaction:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
