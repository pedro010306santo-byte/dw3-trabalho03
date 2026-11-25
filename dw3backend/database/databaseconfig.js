const { Pool } = require('pg');

const pool = new Pool();
pool.on('error', erro => console.error('Erro na conexão PostgreSQL:', erro.message));

module.exports = pool;
