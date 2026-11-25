const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mdlLogin = require('../model/mdlLogin');

async function Login(req, res, next) {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || !username.trim()
      || typeof password !== 'string' || !password || bcrypt.truncates(password)) {
    return res.status(400).json({ auth: false, message: 'Informe um usuário e uma senha válidos.' });
  }

  try {
    const [credencial] = await mdlLogin.GetCredencial(username.trim());
    if (!credencial || !(await bcrypt.compare(password, credencial.passwordhash))) {
      return res.status(401).json({ auth: false, message: 'Usuário ou senha inválidos.' });
    }

    const token = jwt.sign({ username: credencial.username }, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '10m',
    });
    return res.json({ auth: true, token });
  } catch (erro) {
    return next(erro);
  }
}

function AutenticaJWT(req, res, next) {
  const authorization = req.get('authorization') || '';
  const bearer = /^Bearer (\S+)$/i.exec(authorization);
  if (!bearer) {
    return res.status(401).json({ auth: false, message: 'Informe o token JWT.' });
  }

  try {
    req.usuario = jwt.verify(bearer[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({ auth: false, message: 'JWT inválido ou expirado.' });
  }
  return next();
}

function Logout(req, res) {
  return res.json({ auth: false, token: null });
}

module.exports = { Login, AutenticaJWT, Logout };
