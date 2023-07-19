import app from './app.js';
import { sequelize } from './sequelize.js';

const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT) || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
    app.listen(port, () => console.log(`[Ready] http://${host}:${port}`));
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();
