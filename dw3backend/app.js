require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routes/router');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:40100' }));
app.use(express.json());
app.use('/', router);

app.use((erro, req, res, next) => {
  if (res.headersSent) return next(erro);
  if (erro instanceof SyntaxError && erro.status === 400) {
    return res.status(400).json({ status: 'erro', message: 'JSON inválido.' });
  }
  console.error(erro.message);
  res.status(500).json({ status: 'erro', message: 'Não foi possível concluir a operação.' });
});

if (require.main === module) {
  if (!process.env.JWT_SECRET) throw new Error('Configure a variável JWT_SECRET.');
  const porta = process.env.PORT || 40000;
  app.listen(porta, () => console.log('Back-end na porta ' + porta));
}

module.exports = app;
