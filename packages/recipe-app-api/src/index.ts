import app from './app';

const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT) || 4000;

app.listen(port, () => console.log(`[Ready] http://${host}:${port}`));
