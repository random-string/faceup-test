import { debug } from '../src/logger';
import { dbSchema } from '../config/dbSchema';
import express from 'express';
import postgres from 'pg';
import basicAuth from 'express-basic-auth';

export async function deleteRoute(
	request: basicAuth.IBasicAuthedRequest,
	response: express.Response,
	next: express.NextFunction
) {
	debug('/delete/');
	if (request?.auth?.user !== 'admin') return next('Unauthorized');
	try {
		if (request?.auth?.user !== 'admin') return next('Unauthorized');
		if (!request.params?.id) throw new Error('No id provided!'); // should never happen, route is defined with id
		const dbPool: postgres.Pool = await request.app.get('db');
		const dbClient: postgres.PoolClient = await dbPool.connect();
		const result = await dbClient.query(`DELETE FROM ${dbSchema.tableName} WHERE _id = ${request.params.id}`);
		dbClient.release();
		response.status(200).send(`Deleted ${result?.rowCount} rows`);
	} catch (err) {
		return next(err);
	}
}
