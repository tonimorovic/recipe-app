import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { koaMiddleware } from '@as-integrations/koa';

import healthRouter from './routes/health.js';

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

const app = new Koa();
const httpServer = http.createServer(app.callback());

const server = new ApolloServer({ typeDefs, resolvers, plugins: [ApolloServerPluginDrainHttpServer({ httpServer })] });

await server.start();

app.use(cors());
app.use(bodyParser());

app.use(healthRouter.routes());

app.use(koaMiddleware(server, { context: async ({ ctx }) => ({ token: ctx.headers.token }) }));

export default app;
