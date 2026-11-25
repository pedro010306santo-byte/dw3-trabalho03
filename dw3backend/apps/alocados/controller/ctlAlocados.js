const mdlAlocados = require('../model/mdlAlocados');
const { idValido, responderEscrita, responderErro } = require('../../respostas');

async function GetAllAlocados(req, res) {
  try {
    const registro = await mdlAlocados.GetAllAlocados();
    res.json({ status: 'ok', registro });
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function GetAlocadoByID(req, res) {
  if (!idValido(req, res)) return;

  try {
    const registro = await mdlAlocados.GetAlocadoByID(Number(req.params.id));
    res.json({ status: 'ok', registro });
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function InsertAlocado(req, res) {
  try {
    responderEscrita(res, await mdlAlocados.InsertAlocado(req.body || {}));
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function UpdateAlocado(req, res) {
  if (!idValido(req, res)) return;

  try {
    responderEscrita(res, await mdlAlocados.UpdateAlocado(Number(req.params.id), req.body || {}));
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function DeleteAlocado(req, res) {
  if (!idValido(req, res)) return;

  try {
    responderEscrita(res, await mdlAlocados.DeleteAlocado(Number(req.params.id)));
  } catch (erro) {
    responderErro(res, erro);
  }
}

module.exports = {
  GetAllAlocados,
  GetAlocadoByID,
  InsertAlocado,
  UpdateAlocado,
  DeleteAlocado,
};
