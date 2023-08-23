import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../../src/entity/user/User.js';
import pgconn from 'pg-connection-string';
import { Recipe } from '../../src/entity/recipe/Recipe.js';
import { Category } from '../../src/entity/category/Category.js';
import { Comment } from '../../src/entity/comment/Comment.js';
import { Review } from '../../src/entity/review/Review.js';
import { Purchase } from '../../src/entity/purchase/Purchase.js';
import { List } from '../../src/entity/list/List.js';
import { Migrations1692713310203 } from '../migrations/1692713310203-migrations.js';

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
  entities: [User, Recipe, Category, Comment, Review, Purchase, List],
  migrations: [Migrations1692713310203],
  subscribers: [],
});
