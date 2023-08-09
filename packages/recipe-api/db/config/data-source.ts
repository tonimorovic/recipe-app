import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../../src/entity/User.js';
import pgconn from 'pg-connection-string';
import { Migrations1691570994749 } from '../migrations/1691570994749-user.js';

const { host, port, user, password, database } = pgconn.parse(process.env.PG_CONNECTION_STRING || 'postgres://');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: host || 'localhost',
  port: Number(port) || 5432,
  username: user || 'toni',
  password: password || 'password',
  database: database || 'recipe-db',
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: [Migrations1691570994749],
  subscribers: [],
});
