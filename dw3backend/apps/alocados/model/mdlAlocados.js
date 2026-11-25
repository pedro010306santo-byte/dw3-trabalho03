const db = require('../../../database/databaseconfig');

async function GetAllAlocados() {
  const resultado = await db.query(
    'SELECT alocadoid, animalidifk, piqueteidfk, datainicio::text AS datainicio, datafinal::text AS datafinal, removido FROM alocado WHERE removido = false ORDER BY datainicio DESC, alocadoid'
  );
  return resultado.rows;
}

async function GetAlocadoByID(id) {
  const resultado = await db.query(
    'SELECT alocadoid, animalidifk, piqueteidfk, datainicio::text AS datainicio, datafinal::text AS datafinal, removido FROM alocado WHERE alocadoid = $1 AND removido = false',
    [id]
  );
  return resultado.rows;
}

async function InsertAlocado(registro) {
  const resultado = await db.query(
    'INSERT INTO alocado (animalidifk, piqueteidfk, datainicio, datafinal) VALUES ($1, $2, $3, $4)',
    [registro.animalidifk, registro.piqueteidfk, registro.datainicio, registro.datafinal]
  );
  return resultado.rowCount;
}

async function UpdateAlocado(id, registro) {
  const resultado = await db.query(
    'UPDATE alocado SET animalidifk = $2, piqueteidfk = $3, datainicio = $4, datafinal = $5 ' +
      'WHERE alocadoid = $1 AND removido = false',
    [id, registro.animalidifk, registro.piqueteidfk, registro.datainicio, registro.datafinal]
  );
  return resultado.rowCount;
}

async function DeleteAlocado(id) {
  const resultado = await db.query(
    'UPDATE alocado SET removido = true WHERE alocadoid = $1 AND removido = false',
    [id]
  );
  return resultado.rowCount;
}

module.exports = {
  GetAllAlocados,
  GetAlocadoByID,
  InsertAlocado,
  UpdateAlocado,
  DeleteAlocado,
};
