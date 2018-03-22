import express from 'express';
import levelup from 'levelup';
import leveldown from 'leveldown';

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.info(`Lisening on ${port}...`);
});
