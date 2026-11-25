const db = require('../../../database/databaseconfig');

async function GetCredencial(username) {
  const resultado = await db.query(
    'SELECT username, passwordhash FROM login WHERE username = $1 AND removido = false',
    [username],
  );
  return resultado.rows;
}

async function InsertUsuario(username, passwordhash) {
  await db.query(
    'INSERT INTO login (username, passwordhash) VALUES ($1, $2)',
    [username, passwordhash],
  );
}

module.exports = { GetCredencial, InsertUsuario };
