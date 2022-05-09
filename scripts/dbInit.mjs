import 'dotenv/config';

import { debug, error } from '../src/logger';

import postgres from 'pg';
import { dbSchema } from '../config/dbSchema.js';

debug('dbInit script started');
dbInit()
	.then(() => debug('dbInit done!'))
	.catch(error);

export default async function dbInit() {
	var dbClient = new postgres.Client({
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		database: 'postgres',
		password: process.env.PGPASSWORD,
		port: process.env.PGPORT,
	});
	dbClient.connect();

	try {
		await dbClient.query(`CREATE DATABASE ${process.env.PGDATABASE}`);
	} catch (err) {
		// Postgres doesn't support IF NOT EXISTS on CREATE DATABASE, so we just catch the error
		debug(err.message);
	}
	await dbClient.end();

	dbClient = new postgres.Client({
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		database: process.env.PGDATABASE,
		password: process.env.PGPASSWORD,
		port: process.env.PGPORT,
	});
	dbClient.connect();

	const tableResult = await dbClient.query(
		`CREATE TABLE IF NOT EXISTS ${dbSchema.tableName} (` +
			`_id SERIAL PRIMARY KEY,` +
			`${dbSchema.columnNames.firstName} VARCHAR(32) NOT NULL,` +
			`${dbSchema.columnNames.surname} VARCHAR(32) NOT NULL,` +
			`${dbSchema.columnNames.dateOfBirth} DATE NOT NULL,` +
			`${dbSchema.columnNames.timeAdded} TIMESTAMP NOT NULL,` +
			`${dbSchema.columnNames.message} TEXT NOT NULL,` +
			`${dbSchema.columnNames.editCount} SMALLINT,` +
			`${dbSchema.columnNames.lastEdit} TIMESTAMP,` +
			`${dbSchema.columnNames.editUser} VARCHAR(32)` +
			`)`
	);
	debug(tableResult);

	await dbClient.end();
}
