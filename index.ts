import 'dotenv/config';
import { debug, error } from './src/logger';

import postgres from 'pg'; // knex could be used for a nice promise chain api
const pool = new postgres.Pool(); // max cliets defaults to 10

import app from './src/app';
app.set('db', pool);
app.listen(process.env.PORT || 3000, () => debug(`App listening on port ${process.env.PORT || 3000}`));

/**
 * Disconnect DB on exit
 */
['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) =>
	process.on(eventType, () => disconnectOnExit(eventType))
);

export function disconnectOnExit(eventType: string) {
	debug(eventType);
	pool
		?.end()
		?.then(() => {
			debug('Database disconnected, exiting');
			process.exit();
		})
		?.catch(error)
		?.then(() => process.exit());
}
