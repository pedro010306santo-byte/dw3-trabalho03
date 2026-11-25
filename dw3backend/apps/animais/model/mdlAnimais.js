const db = require('../../../database/databaseconfig');

async function GetAllAnimais() {
  const resultado = await db.query(
    'SELECT animalid, nome, datanasc::text AS datanasc, removido FROM animal WHERE removido = false ORDER BY nome, animalid'
  );
  return resultado.rows;
}

async function GetAnimalByID(id) {
  const resultado = await db.query(
    'SELECT animalid, nome, datanasc::text AS datanasc, removido FROM animal WHERE animalid = $1 AND removido = false',
    [id]
  );
  return resultado.rows;
}

async function InsertAnimal(registro) {
  const resultado = await db.query(
    'INSERT INTO animal (nome, datanasc) VALUES ($1, $2)',
    [registro.nome, registro.datanasc]
  );
  return resultado.rowCount;
}

async function UpdateAnimal(id, registro) {
  const resultado = await db.query(
    'UPDATE animal SET nome = $2, datanasc = $3 ' +
      'WHERE animalid = $1 AND removido = false',
    [id, registro.nome, registro.datanasc]
  );
  return resultado.rowCount;
}

async function DeleteAnimal(id) {
  const resultado = await db.query(
    'UPDATE animal SET removido = true WHERE animalid = $1 AND removido = false',
    [id]
  );
  return resultado.rowCount;
}

module.exports = {
  GetAllAnimais,
  GetAnimalByID,
  InsertAnimal,
  UpdateAnimal,
  DeleteAnimal,
};
