import { debug } from '../src/logger';
import { dbSchema } from '../config/dbSchema';
import express from 'express';
import postgres from 'pg';

export async function readAll(request: express.Request, response: express.Response, next: express.NextFunction) {
	debug('/readAll');
	try {
		const dbPool: postgres.Pool = await request.app.get('db');
		const dbClient: postgres.PoolClient = await dbPool.connect();
		const result = await dbClient.query(
			`SELECT *, date_part('year',age(${dbSchema.columnNames.dateOfBirth})) as age FROM ${dbSchema.tableName}`
		);
		dbClient.release();
		response.send(result?.rows);
	} catch (err) {
		return next(err);
	}
}
