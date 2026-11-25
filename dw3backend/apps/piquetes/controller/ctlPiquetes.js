const mdlPiquetes = require('../model/mdlPiquetes');
const { idValido, responderEscrita, responderErro } = require('../../respostas');

function areaValida(registro, res) {
  const area = registro?.areausada;
  if ((typeof area === 'string' || typeof area === 'number') &&
      Number.isFinite(Number(area)) && Number(area) > 0) return true;
  res.status(400).json({ status: 'Informe a área usada em alqueires, maior que zero.' });
  return false;
}

async function GetAllPiquetes(req, res) {
  try {
    const registro = await mdlPiquetes.GetAllPiquetes();
    res.json({ status: 'ok', registro });
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function GetPiqueteByID(req, res) {
  if (!idValido(req, res)) return;

  try {
    const registro = await mdlPiquetes.GetPiqueteByID(Number(req.params.id));
    res.json({ status: 'ok', registro });
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function InsertPiquete(req, res) {
  if (!areaValida(req.body, res)) return;
  try {
    responderEscrita(res, await mdlPiquetes.InsertPiquete(req.body || {}));
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function UpdatePiquete(req, res) {
  if (!idValido(req, res)) return;
  if (!areaValida(req.body, res)) return;

  try {
    responderEscrita(res, await mdlPiquetes.UpdatePiquete(Number(req.params.id), req.body || {}));
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function DeletePiquete(req, res) {
  if (!idValido(req, res)) return;

  try {
    const { bloqueado, linhasAfetadas } = await mdlPiquetes.DeletePiquete(Number(req.params.id));
    if (bloqueado) {
      return res.status(409).json({ status: 'Este piquete tem alocações vinculadas. Remova ou edite essas alocações primeiro.' });
    }
    responderEscrita(res, linhasAfetadas);
  } catch (erro) {
    responderErro(res, erro);
  }
}

module.exports = {
  GetAllPiquetes,
  GetPiqueteByID,
  InsertPiquete,
  UpdatePiquete,
  DeletePiquete,
};
