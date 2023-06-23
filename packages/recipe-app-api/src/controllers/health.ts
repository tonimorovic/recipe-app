import { Context } from 'koa';

const healthCheck = (ctx: Context) => {
  ctx.body = { version: process.env.npm_package_version, environmentVariableSetting: process.env.NODE_ENV };
};

export default healthCheck;
