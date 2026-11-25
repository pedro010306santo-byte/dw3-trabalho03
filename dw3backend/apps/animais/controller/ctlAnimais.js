const mdlAnimais = require('../model/mdlAnimais');
const { idValido, responderEscrita, responderErro } = require('../../respostas');

async function GetAllAnimais(req, res) {
  try {
    const registro = await mdlAnimais.GetAllAnimais();
    res.json({ status: 'ok', registro });
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function GetAnimalByID(req, res) {
  if (!idValido(req, res)) return;

  try {
    const registro = await mdlAnimais.GetAnimalByID(Number(req.params.id));
    res.json({ status: 'ok', registro });
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function InsertAnimal(req, res) {
  try {
    responderEscrita(res, await mdlAnimais.InsertAnimal(req.body || {}));
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function UpdateAnimal(req, res) {
  if (!idValido(req, res)) return;

  try {
    responderEscrita(res, await mdlAnimais.UpdateAnimal(Number(req.params.id), req.body || {}));
  } catch (erro) {
    responderErro(res, erro);
  }
}

async function DeleteAnimal(req, res) {
  if (!idValido(req, res)) return;

  try {
    const { bloqueado, linhasAfetadas } = await mdlAnimais.DeleteAnimal(Number(req.params.id));
    if (bloqueado) {
      return res.status(409).json({ status: 'Este animal tem alocações vinculadas. Remova ou edite essas alocações primeiro.' });
    }
    responderEscrita(res, linhasAfetadas);
  } catch (erro) {
    responderErro(res, erro);
  }
}

module.exports = {
  GetAllAnimais,
  GetAnimalByID,
  InsertAnimal,
  UpdateAnimal,
  DeleteAnimal,
};
