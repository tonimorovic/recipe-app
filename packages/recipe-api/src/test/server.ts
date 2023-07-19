import supertest from 'supertest';
import app from '../app.js';

const server = supertest(app.callback());

export default server;
