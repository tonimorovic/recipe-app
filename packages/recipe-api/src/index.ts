import app from './app.js';
import { AppDataSource } from '../db/config/data-source.js';
const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT) || 4000;

try {
  await AppDataSource.initialize();
  console.log('Connection to database has been established successfully.');
  app.listen(port, () => console.log(`[Ready] http://${host}:${port}`));
} catch (err) {
  console.error('Unable to connect to the database:', err);
  process.exit(1);
}
