const mdlPastos = require('../model/mdlPastos');
const { idValido, responderEscrita, responderErro } = require('../../respostas');

async function GetAllPastos(req, res) {
  try {
    const registro = await mdlPastos.GetAllPastos();
    res.json({ status: 'ok', registro });
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function GetPastoByID(req, res) {
  if (!idValido(req, res)) return;

  try {
    const registro = await mdlPastos.GetPastoByID(Number(req.params.id));
    res.json({ status: 'ok', registro });
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function InsertPasto(req, res) {
  try {
    responderEscrita(res, await mdlPastos.InsertPasto(req.body || {}));
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function UpdatePasto(req, res) {
  if (!idValido(req, res)) return;

  try {
    responderEscrita(res, await mdlPastos.UpdatePasto(Number(req.params.id), req.body || {}));
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function DeletePasto(req, res) {
  if (!idValido(req, res)) return;

  try {
    const { bloqueado, linhasAfetadas } = await mdlPastos.DeletePasto(Number(req.params.id));
    if (bloqueado) {
      return res.status(409).json({ status: 'Este pasto tem piquetes vinculados. Remova ou transfira esses piquetes primeiro.' });
    }
    responderEscrita(res, linhasAfetadas);
  } catch (erro) {
    responderErro(res, erro);
  }
}

module.exports = {
  GetAllPastos,
  GetPastoByID,
  InsertPasto,
  UpdatePasto,
  DeletePasto,
};
