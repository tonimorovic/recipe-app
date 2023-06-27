import { Sequelize } from 'sequelize';

const { NODE_ENV, PG_USER, PG_PASSWORD, PG_HOST, PG_DATABASE, PG_PORT } = process.env;

const dbConnection = () =>
  new Sequelize({
    database: PG_DATABASE,
    dialect: 'postgres',
    username: PG_USER,
    password: PG_PASSWORD,
    port: Number(PG_PORT),
    host: PG_HOST,
    dialectOptions: {
      ssl: NODE_ENV === 'production',
    },
    ssl: NODE_ENV === 'production',
    hooks: {
      beforeBulkUpdate(options) {
        options.individualHooks = true;
      },
      beforeBulkCreate(model, options) {
        options.individualHooks = true;
      },
      beforeBulkDestroy(options) {
        options.individualHooks = true;
      },
      afterCreate(model) {
        NODE_ENV !== 'production' && console.log(model, 'create');
      },
      afterUpdate(model) {
        NODE_ENV !== 'production' && console.log(model, 'update');
      },
      afterDestroy(model) {
        NODE_ENV !== 'production' && console.log(model, 'destroy');
      },
    },
  });

export const sequelize = dbConnection();
