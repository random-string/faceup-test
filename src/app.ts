import 'dotenv/config';

import { error } from './logger';
import path from 'path'; // because only importing join() might be confusing

import express from 'express';
import bodyParser from 'body-parser';
import { auth } from './auth';

import { create } from '../routes/create';
import { read } from '../routes/read';
import { readAll } from '../routes/readAll';
import { update } from '../routes/update';
import { deleteRoute } from '../routes/delete';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request: express.Request, response: express.Response, next: express.NextFunction) => {
	response.sendFile(path.join(__dirname, '../../public/index.html')); // fake front-end
});
app.post('/create', create);
app.get('/read/:id', read);
app.get('/readAll', readAll);

app.use('/update', auth);
app.post('/update', update);

app.use('/delete/:id', auth);
app.post('/delete/:id', deleteRoute);

app.use((err: unknown, request: express.Request, response: express.Response, next: express.NextFunction) => {
	error(err);
	if (err === 'Unauthorized') return response.status(401).send(err); // error codes in an enum would be better
	response.status(500).send(err);
});

export default app;
