import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { koaMiddleware } from '@as-integrations/koa';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFiles } from '@graphql-tools/load-files';

import healthRouter from './routes/health.js';

const app = new Koa();
const httpServer = http.createServer(app.callback());

const typeDefsArray = await loadFiles('**/*', { extensions: ['graphql'] });
const resolversArray = await loadFiles('**/*', { extensions: ['resolvers.ts'] });

const schema = makeExecutableSchema({ typeDefs: typeDefsArray, resolvers: resolversArray });

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(cors());
app.use(bodyParser());

app.use(healthRouter.routes());

app.use(koaMiddleware(server, { context: async ({ ctx }) => ({ token: ctx.headers.token }) }));

export default app;
