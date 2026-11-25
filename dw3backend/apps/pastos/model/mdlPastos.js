const db = require('../../../database/databaseconfig');

async function GetAllPastos() {
  const resultado = await db.query(
    'SELECT * FROM pasto WHERE removido = false ORDER BY descricao, pastoid'
  );
  return resultado.rows;
}

async function GetPastoByID(id) {
  const resultado = await db.query(
    'SELECT * FROM pasto WHERE pastoid = $1 AND removido = false',
    [id]
  );
  return resultado.rows;
}

async function InsertPasto(registro) {
  const resultado = await db.query(
    'INSERT INTO pasto (descricao, areatotal) VALUES ($1, $2)',
    [registro.descricao, registro.areatotal]
  );
  return resultado.rowCount;
}

async function UpdatePasto(id, registro) {
  const resultado = await db.query(
    'UPDATE pasto SET descricao = $2, areatotal = $3 ' +
      'WHERE pastoid = $1 AND removido = false',
    [id, registro.descricao, registro.areatotal]
  );
  return resultado.rowCount;
}

async function DeletePasto(id) {
  const resultado = await db.query(
    'UPDATE pasto SET removido = true WHERE pastoid = $1 AND removido = false',
    [id]
  );
  return resultado.rowCount;
}

module.exports = {
  GetAllPastos,
  GetPastoByID,
  InsertPasto,
  UpdatePasto,
  DeletePasto,
};
