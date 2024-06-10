import axios from 'axios';
const API_KEY = 'MK_TEST_VKMVS929KW';
const SECRET_KEY = 'X3500BXPGW51TW1K1G3DPZHABAPW1K7B';

const getToken = async () => {
	const encodedCredentials = Buffer.from(`${API_KEY}:${SECRET_KEY}`).toString(
		'base64'
	);
	const authHeader = `Basic ${encodedCredentials}`;

	try {
		const response = await axios.post(
			'https://sandbox.monnify.com/api/v1/auth/login',
			{},
			{
				headers: {
					Authorization: authHeader,
				},
			}
		);

		if (response.data.requestSuccessful) {
			return response.data.responseBody.accessToken;
		} else {
			throw new Error('Failed to get access token');
		}
	} catch (error) {
		console.error('Error getting access token:', error);
		throw error;
	}
};

export default getToken;
