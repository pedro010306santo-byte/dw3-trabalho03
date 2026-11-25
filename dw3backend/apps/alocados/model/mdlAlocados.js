const db = require('../../../database/databaseconfig');

async function GetAllAlocados() {
  const resultado = await db.query(
    `SELECT a.alocadoid, a.animalidifk, a.piqueteidfk,
            a.datainicio::text AS datainicio, a.datafinal::text AS datafinal,
            a.removido, animal.nome AS animalnome, piquete.descricao AS piquetenome
       FROM alocado a
       JOIN animal ON animal.animalid = a.animalidifk
       JOIN piquete ON piquete.piqueteid = a.piqueteidfk
      WHERE a.removido = false
      ORDER BY a.datainicio DESC, a.alocadoid`
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

async function InsertAlocado(registro, animais) {
  const resultado = await db.query(
    `INSERT INTO alocado (animalidifk, piqueteidfk, datainicio, datafinal)
     SELECT animalid, $2, $3, $4 FROM unnest($1::integer[]) AS ids(animalid)`,
    [animais, registro.piqueteidfk, registro.datainicio, registro.datafinal]
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
