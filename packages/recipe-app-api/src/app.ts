import Koa from 'koa';
import healthRouter from './routes/health';

const app = new Koa();

app.use(healthRouter.routes());

export default app;
