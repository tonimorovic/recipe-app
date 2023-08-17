import supertest from 'supertest';
import app from '../app.js';
import { AppDataSource } from '../../db/config/data-source.js';

await AppDataSource.initialize();

const server = supertest(app.callback());

export const graphQLServer = () => server.post('/graphql').set('Content-Type', 'application/json');

export default server;
