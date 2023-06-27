import supertest from 'supertest';
import app from '../app';

const server = supertest(app.callback());

export default server;
