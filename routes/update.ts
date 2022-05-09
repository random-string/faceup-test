import { debug } from '../src/logger';
import { dbSchema } from '../config/dbSchema';
import { updateParams } from './update.types';
import express from 'express';
import postgres from 'pg';
import basicAuth from 'express-basic-auth';

import ajv from '../src/validator';
import jsonSchema from './update.schema.js';
const validate = ajv.compile(jsonSchema.updateParams);

export async function update(
	request: basicAuth.IBasicAuthedRequest,
	response: express.Response,
	next: express.NextFunction
) {
	debug('/update');
	if (request?.auth?.user !== 'admin') return next('Unauthorized');
	try {
		const payload = request.body; // should clone
		payload.dateOfBirth = new Date(request.body.dateOfBirth).toISOString(); // our json shcema expects iso string, could be definitely done better
		payload.id = parseInt(payload.id); // i use a dumb form so do unnecessary transformations that would be redundant with proper JSON
		if (!validate(payload)) return next('Invalid payload!');

		const dbPool: postgres.Pool = await request.app.get('db');
		const dbClient: postgres.PoolClient = await dbPool.connect();
		const { id, firstName, surname, dateOfBirth, message }: updateParams = request.body;

		await dbClient.query(
			`UPDATE ${dbSchema.tableName} SET ` +
				`${dbSchema.columnNames.firstName} = $1, ` +
				`${dbSchema.columnNames.surname} = $2, ` +
				`${dbSchema.columnNames.dateOfBirth} = $3, ` +
				`${dbSchema.columnNames.message} = $4, ` +
				`${dbSchema.columnNames.lastEdit} = $5, ` +
				`${dbSchema.columnNames.editUser} = $6 ` +
				`WHERE _id=${id}`,
			[firstName, surname, dateOfBirth, message, new Date(), request.auth.user]
		);
		dbClient.release();
		response.sendStatus(200);
	} catch (err) {
		return next(err);
	}
}
