function idValido(req, res) {
  const parametro = req.params.id;
  const id = Number(parametro);
  if (/^\d+$/.test(parametro) && Number.isSafeInteger(id) && id > 0 && id <= 2147483647) {
    return true;
  }

  res.status(400).json({ status: 'ID inválido.' });
  return false;
}

function responderEscrita(res, linhasAfetadas) {
  if (linhasAfetadas === 0) {
    res.status(404).json({ status: 'Registro não encontrado.', linhasAfetadas });
    return;
  }

  res.json({ status: 'ok', linhasAfetadas });
}

function responderErro(res, erro) {
  if (erro.code === '23503') {
    res.status(400).json({ status: 'O registro relacionado não existe.', linhasAfetadas: -1 });
    return;
  }

  if (erro.code?.startsWith('22') || erro.code?.startsWith('23')) {
    res.status(400).json({ status: 'Confira os dados informados.', linhasAfetadas: -1 });
    return;
  }

  console.error('Erro na operação de banco de dados:', erro.code || erro.message);
  res.status(500).json({ status: 'Erro ao executar a operação.', linhasAfetadas: -1 });
}

module.exports = { idValido, responderEscrita, responderErro };
