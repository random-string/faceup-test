import { debug } from '../src/logger';
import { dbSchema } from '../config/dbSchema';
import express from 'express';
import postgres from 'pg';

export async function read(request: express.Request, response: express.Response, next: express.NextFunction) {
	debug('/read/');
	try {
		if (!request.params?.id) throw new Error('No id provided!'); // should never happen, route is defined with id
		const dbPool: postgres.Pool = await request.app.get('db');
		const dbClient: postgres.PoolClient = await dbPool.connect();
		const result = await dbClient.query(
			`SELECT ` +
				`${dbSchema.columnNames.firstName}, ` +
				`${dbSchema.columnNames.surname}, ` +
				`${dbSchema.columnNames.message}, ` +
				`date_part('year',age(${dbSchema.columnNames.dateOfBirth})) as age, ` +
				`${dbSchema.columnNames.lastEdit} ` +
				`FROM ${dbSchema.tableName} ` +
				`WHERE _id = ${request.params.id}`
		);
		dbClient.release();
		response.send(result?.rows);
	} catch (err) {
		return next(err);
	}
}
