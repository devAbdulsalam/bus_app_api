import getToken from '../utils/monnify.js';

export const create = async (req, res) => {
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
		res.status(500).json({ error: error?.message });
	}
};
