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
  const registro = req.body || {};
  const selecionados = [registro.animalidifk].flat();
  const animais = [...new Set(selecionados.map(id => {
    return typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))
      ? Number(id) : NaN;
  }))];
  if (!animais.length || animais.some(id => !Number.isInteger(id) || id < 1 || id > 2147483647)) {
    return res.status(400).json({ status: 'Selecione pelo menos um animal válido.' });
  }
  try {
    responderEscrita(res, await mdlAlocados.InsertAlocado(registro, animais));
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
