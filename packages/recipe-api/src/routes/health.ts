import KoaRouter from '@koa/router';
import healthCheck from '../controllers/health.js';

const healthRouter = new KoaRouter();

healthRouter.get('/health', healthCheck);

export default healthRouter;
