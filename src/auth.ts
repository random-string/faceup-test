import basicAuth from 'express-basic-auth';

export const auth = basicAuth({
	users: { admin: 'admin' },
	challenge: true,
});
