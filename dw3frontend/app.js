const express = require('express');
const nunjucks = require('nunjucks');
const path = require('node:path');
const modulos = require('./modulos');

const app = express();
const port = process.env.PORT || 40100;

nunjucks.configure(path.join(__dirname, 'views'), { autoescape: true, express: app });
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.locals.servidorDw3 = process.env.SERVIDOR_DW3 || 'http://localhost:40000';
app.locals.modulos = modulos;

app.get('/', (req, res) => res.render('home.njk', { pagina: 'home' }));
app.get('/login', (req, res) => res.render('login.njk', { pagina: 'login' }));

for (const modulo of modulos) {
  const router = express.Router();
  router.get('/', (req, res) => res.render('lista.njk', { pagina: 'lista', modulo }));
  router.get('/form', (req, res) => {
    const { oper, id } = req.query;
    if (!['Cr', 'Re', 'Up', 'De'].includes(oper) ||
        (oper !== 'Cr' && (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)))) {
      return res.status(400).send('Operação ou ID inválido.');
    }
    res.render('formulario.njk', { pagina: 'formulario', modulo, oper, idRegistro: oper === 'Cr' ? '' : id });
  });
  app.use('/' + modulo.slug, router);
}

app.listen(port, () => console.log('Front-end na porta ' + port));
