import getToken from '../utils/monnify.js';

export const create = async (req, res) => {
	const { customerName, customerEmail, amount } = req.body;

	const accessToken = await getToken();
	console.log('accessToken', accessToken);

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
				redirectUrl: '/',
			}),
		}
	);

	const data = await response.json();
	res.json({ paymentUrl: data.responseBody.checkoutUrl });
};
