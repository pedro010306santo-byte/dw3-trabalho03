const db = require('../../../database/databaseconfig');

async function GetAllPiquetes() {
  const resultado = await db.query(
    'SELECT * FROM piquete WHERE removido = false ORDER BY descricao, piqueteid'
  );
  return resultado.rows;
}

async function GetPiqueteByID(id) {
  const resultado = await db.query(
    'SELECT * FROM piquete WHERE piqueteid = $1 AND removido = false',
    [id]
  );
  return resultado.rows;
}

async function InsertPiquete(registro) {
  const resultado = await db.query(
    'INSERT INTO piquete (descricao, latitude, longitude, pastoidfk, areausada) VALUES ($1, $2, $3, $4, $5)',
    [registro.descricao, registro.latitude, registro.longitude, registro.pastoidfk, registro.areausada]
  );
  return resultado.rowCount;
}

async function UpdatePiquete(id, registro) {
  const resultado = await db.query(
    'UPDATE piquete SET descricao = $2, latitude = $3, longitude = $4, pastoidfk = $5, areausada = $6 ' +
      'WHERE piqueteid = $1 AND removido = false',
    [id, registro.descricao, registro.latitude, registro.longitude, registro.pastoidfk, registro.areausada]
  );
  return resultado.rowCount;
}

async function DeletePiquete(id) {
  const resultado = await db.query(
    `WITH vinculo AS (
       SELECT 1 FROM alocado WHERE piqueteidfk = $1 AND removido = false
     ), exclusao AS (
       UPDATE piquete SET removido = true
        WHERE piqueteid = $1 AND removido = false
          AND NOT EXISTS (SELECT 1 FROM vinculo)
       RETURNING 1
     )
     SELECT (SELECT count(*)::integer FROM exclusao) AS "linhasAfetadas",
            EXISTS (SELECT 1 FROM vinculo)
              AND EXISTS (SELECT 1 FROM piquete WHERE piqueteid = $1 AND removido = false) AS bloqueado`,
    [id]
  );
  return resultado.rows[0];
}

module.exports = {
  GetAllPiquetes,
  GetPiqueteByID,
  InsertPiquete,
  UpdatePiquete,
  DeletePiquete,
};
