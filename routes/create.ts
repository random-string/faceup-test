import { debug } from '../src/logger';
import { dbSchema } from '../config/dbSchema';
import { createParams } from './create.types';
import express from 'express';
import postgres from 'pg';

import ajv from '../src/validator';
import jsonSchema from './create.schema.js';
const validate = ajv.compile(jsonSchema.createParams);

export async function create(request: express.Request, response: express.Response, next: express.NextFunction) {
	debug('/create');
	try {
		const payload = request.body; // should clone
		payload.dateOfBirth = new Date(request.body.dateOfBirth).toISOString(); // our json shcema expects iso string, could be definitely done better
		if (!validate(payload)) return next('Invalid payload!');

		const dbPool: postgres.Pool = await request.app.get('db');
		const dbClient: postgres.PoolClient = await dbPool.connect();
		const { firstName, surname, dateOfBirth, message }: createParams = request.body;
		await dbClient.query(
			`INSERT INTO "${dbSchema.tableName}"(
                ${dbSchema.columnNames.firstName}, 
                ${dbSchema.columnNames.surname}, 
                ${dbSchema.columnNames.dateOfBirth}, 
                ${dbSchema.columnNames.message}, 
                ${dbSchema.columnNames.timeAdded})
            VALUES ($1, $2, $3, $4, $5)`,
			[firstName, surname, dateOfBirth, message, new Date()]
		);
		dbClient.release();
		response.sendStatus(200);
	} catch (err) {
		return next(err);
	}
}
