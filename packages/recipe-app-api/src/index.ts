import Koa from 'koa';

const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT) || 4000;

const app = new Koa();

app.use((ctx) => {
  ctx.body = { msg: 'Hello from Koa.js' };
});

app.listen(port, () => console.log(`[Ready] http://${host}:${port}`));
