const path = require('node:path');
const readline = require('node:readline');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: path.join(__dirname, '../.env'), quiet: true });
const db = require('../database/databaseconfig');
const mdlLogin = require('../apps/login/model/mdlLogin');

async function criarUsuario() {
  const username = process.argv[2]?.trim();
  if (process.argv.length !== 3 || !username || process.stdin.isTTY) {
    throw new Error('Informe o usuário como argumento e envie a senha pela entrada padrão.');
  }

  const entrada = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  try {
    const { value: password } = await entrada[Symbol.asyncIterator]().next();
    if (!password || password.length < 8 || bcrypt.truncates(password)) {
      throw new Error('A senha deve ter pelo menos 8 caracteres e no máximo 72 bytes.');
    }

    const passwordhash = await bcrypt.hash(password, 12);
    await mdlLogin.InsertUsuario(username, passwordhash);
    console.log('Usuário cadastrado.');
  } finally {
    entrada.close();
    process.stdin.pause();
  }
}

criarUsuario()
  .catch((erro) => {
    if (erro.code === '23505') {
      console.error('Esse usuário já está cadastrado.');
    } else if (erro.code) {
      console.error('Não foi possível cadastrar o usuário no banco de dados.');
    } else {
      console.error(erro.message);
    }
    process.exitCode = 1;
  })
  .finally(() => db.end());
