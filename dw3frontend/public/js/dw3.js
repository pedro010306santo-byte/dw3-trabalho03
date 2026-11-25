'use strict';

const { servidorDw3, pagina, modulo, oper, id } = document.body.dataset;
const mensagens = document.querySelector('#mensagem');
const token = localStorage.getItem('token');

function sair() {
  localStorage.removeItem('token');
  window.location.replace('/login');
}

async function requisitar(rota, method = 'GET', dados) {
  const headers = { Accept: 'application/json' };
  if (rota !== '/Login') headers.Authorization = 'Bearer ' + token;
  if (dados !== undefined) headers['Content-Type'] = 'application/json';

  let resposta;
  try {
    resposta = await fetch(servidorDw3.replace(/\/+$/, '') + rota, {
      method, headers, body: JSON.stringify(dados),
    });
  } catch {
    throw new Error('Não foi possível acessar a API. Verifique se o back-end está em execução.');
  }

  const resultado = await resposta.json().catch(() => null);
  if (rota !== '/Login' && (resposta.status === 401 || resposta.status === 403 || resultado?.auth === false)) {
    sair();
    throw new Error('Sessão encerrada.');
  }
  if (rota === '/Login' && (!resposta.ok || resultado?.auth !== true || !resultado.token)) {
    throw new Error('Login recusado. Confira o usuário e a senha.');
  }
  if (!resposta.ok || !resultado || (rota !== '/Login' && resultado.status !== 'ok')) {
    throw new Error('A API não concluiu a operação.');
  }
  return resultado;
}

function getAllPastos() {
  return requisitar('/getAllPastos');
}

function getPastoByID(id) {
  return requisitar('/getPastoByID/' + id);
}

function insertPasto(dados) {
  return requisitar('/insertPasto', 'POST', dados);
}

function updatePasto(id, dados) {
  return requisitar('/updatePasto/' + id, 'PUT', dados);
}

function deletePasto(id) {
  return requisitar('/deletePasto/' + id, 'DELETE');
}

function getAllPiquetes() {
  return requisitar('/getAllPiquetes');
}

function getPiqueteByID(id) {
  return requisitar('/getPiqueteByID/' + id);
}

function insertPiquete(dados) {
  return requisitar('/insertPiquete', 'POST', dados);
}

function updatePiquete(id, dados) {
  return requisitar('/updatePiquete/' + id, 'PUT', dados);
}

function deletePiquete(id) {
  return requisitar('/deletePiquete/' + id, 'DELETE');
}

function getAllAnimais() {
  return requisitar('/getAllAnimais');
}

function getAnimalByID(id) {
  return requisitar('/getAnimalByID/' + id);
}

function insertAnimal(dados) {
  return requisitar('/insertAnimal', 'POST', dados);
}

function updateAnimal(id, dados) {
  return requisitar('/updateAnimal/' + id, 'PUT', dados);
}

function deleteAnimal(id) {
  return requisitar('/deleteAnimal/' + id, 'DELETE');
}

function getAllAlocados() {
  return requisitar('/getAllAlocados');
}

function getAlocadoByID(id) {
  return requisitar('/getAlocadoByID/' + id);
}

function insertAlocado(dados) {
  return requisitar('/insertAlocado', 'POST', dados);
}

function updateAlocado(id, dados) {
  return requisitar('/updateAlocado/' + id, 'PUT', dados);
}

function deleteAlocado(id) {
  return requisitar('/deleteAlocado/' + id, 'DELETE');
}

const apis = {
  pastos: { listar: getAllPastos, consultar: getPastoByID, inserir: insertPasto, atualizar: updatePasto, excluir: deletePasto },
  piquetes: { listar: getAllPiquetes, consultar: getPiqueteByID, inserir: insertPiquete, atualizar: updatePiquete, excluir: deletePiquete },
  animais: { listar: getAllAnimais, consultar: getAnimalByID, inserir: insertAnimal, atualizar: updateAnimal, excluir: deleteAnimal },
  alocados: { listar: getAllAlocados, consultar: getAlocadoByID, inserir: insertAlocado, atualizar: updateAlocado, excluir: deleteAlocado },
};

const campos = {
  pastos: ['pastoid', 'descricao', 'areatotal'],
  piquetes: ['piqueteid', 'descricao', 'latitude', 'longitude', 'pastoidfk', 'areausada'],
  animais: ['animalid', 'nome', 'datanasc'],
  alocados: ['alocadoid', 'animalnome', 'piquetenome', 'datainicio', 'datafinal'],
};

const relacionamentos = {
  pastoidfk: { listar: getAllPastos, chave: 'pastoid', rotulo: 'descricao' },
  animalidifk: { listar: getAllAnimais, chave: 'animalid', rotulo: 'nome' },
  piqueteidfk: { listar: getAllPiquetes, chave: 'piqueteid', rotulo: 'descricao' },
};

function mostrarErro(erro) {
  mensagens.textContent = erro.message;
  mensagens.hidden = false;
}

function dataISO(valor) {
  return String(valor ?? '').slice(0, 10);
}

function valorExibido(campo, valor) {
  if (campo === 'areausada' && valor == null) return 'Não informada';
  if (!['datanasc', 'datainicio', 'datafinal'].includes(campo) || !valor) return valor ?? '—';
  return dataISO(valor).split('-').reverse().join('/');
}

async function carregarOcupacao() {
  const status = document.querySelector('#ocupacao-status');
  try {
    const [{ registro: alocacoes }, { registro: piquetes }, { registro: animais }] =
      await Promise.all([getAllAlocados(), getAllPiquetes(), getAllAnimais()]);
    const piquetesPorId = new Map(piquetes.map(item => [String(item.piqueteid), item.descricao]));
    const animaisPorId = new Map(animais.map(item => [String(item.animalid), item.nome]));
    const agora = new Date();
    const hoje = [agora.getFullYear(), agora.getMonth() + 1, agora.getDate()]
      .map(parte => String(parte).padStart(2, '0')).join('-');
    const ocupacao = alocacoes
      .filter(item => dataISO(item.datainicio) <= hoje && hoje <= dataISO(item.datafinal))
      .map(item => ({
        piquete: piquetesPorId.get(String(item.piqueteidfk)) ?? 'Piquete #' + item.piqueteidfk,
        animal: animaisPorId.get(String(item.animalidifk)) ?? 'Animal #' + item.animalidifk,
        fim: dataISO(item.datafinal),
      }))
      .sort((a, b) => a.piquete.localeCompare(b.piquete, 'pt-BR') ||
        a.fim.localeCompare(b.fim) || a.animal.localeCompare(b.animal, 'pt-BR'));

    if (!ocupacao.length) {
      status.textContent = 'Nenhum animal está alocado hoje.';
      return;
    }
    const corpo = document.querySelector('#ocupacao-registros');
    for (const item of ocupacao) {
      const linha = corpo.insertRow();
      linha.insertCell().textContent = item.piquete;
      linha.insertCell().textContent = item.animal;
      linha.insertCell().textContent = valorExibido('datafinal', item.fim);
    }
    document.querySelector('#ocupacao-tabela').hidden = false;
    status.hidden = true;
  } catch (erro) {
    status.hidden = true;
    throw erro;
  }
}

async function carregarLista() {
  const { registro } = await apis[modulo].listar();
  const corpo = document.querySelector('#registros');
  corpo.replaceChildren();
  for (const item of registro) {
    const linha = corpo.insertRow();
    for (const campo of campos[modulo]) {
      linha.insertCell().textContent = valorExibido(campo, item[campo]);
    }
    const acoes = linha.insertCell();
    acoes.className = 'acoes-registro';
    for (const [operacao, rotulo] of [['Re', 'Consultar'], ['Up', 'Editar'], ['De', 'Excluir']]) {
      const link = document.createElement('a');
      const idRegistro = item[campos[modulo][0]];
      link.href = '/' + modulo + '/form?' + new URLSearchParams({ oper: operacao, id: idRegistro });
      link.textContent = rotulo;
      link.setAttribute('aria-label', rotulo + ' registro ' + idRegistro);
      link.className = 'btn btn-sm ' + (operacao === 'De' ? 'btn-outline-danger' : 'btn-outline-secondary');
      acoes.append(link);
    }
  }
  if (!registro.length) {
    const celula = corpo.insertRow().insertCell();
    celula.colSpan = campos[modulo].length + 1;
    celula.textContent = 'Nenhum registro encontrado.';
  }
}

async function preencherOpcoes(select, valorAtual) {
  const { listar, chave, rotulo } = relacionamentos[select.name];
  const { registro } = await listar();
  for (const item of registro) {
    const texto = select.name === 'pastoidfk'
      ? item[rotulo] + ' (' + item.areatotal + ' alqueires)'
      : item[rotulo];
    select.add(new Option(texto, item[chave]));
  }
  if (valorAtual != null && !registro.some(item => String(item[chave]) === String(valorAtual))) {
    select.add(new Option('Registro #' + valorAtual + ' (inativo)', valorAtual));
  }
}

function configurarEnvio(formulario, acao) {
  const botao = formulario.querySelector('button[type="submit"]');
  formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (botao.disabled) return;
    botao.disabled = true;
    mensagens.hidden = true;
    try {
      const camposEnviados = new FormData(formulario);
      const dados = Object.fromEntries(camposEnviados);
      const selecaoMultipla = formulario.querySelector('select[multiple]');
      if (selecaoMultipla) dados[selecaoMultipla.name] = camposEnviados.getAll(selecaoMultipla.name);
      await acao(dados);
    } catch (erro) {
      mostrarErro(erro);
    } finally {
      botao.disabled = false;
    }
  });
}

async function carregarFormulario() {
  const formulario = document.querySelector('#crud-form');
  const botao = formulario.querySelector('button[type="submit"]');
  const api = apis[modulo];
  const camposFormulario = [...formulario.querySelectorAll('input[name], select[name]')];
  if (botao) botao.disabled = true;
  for (const campo of camposFormulario) campo.disabled = true;

  const dados = oper === 'Cr' ? {} : (await api.consultar(id)).registro[0];
  if (!dados) throw new Error('Registro não encontrado.');
  await Promise.all(camposFormulario.filter(campo => campo.tagName === 'SELECT')
    .map(campo => preencherOpcoes(campo, dados[campo.name])));
  for (const campo of camposFormulario) {
    campo.value = campo.type === 'date' ? dataISO(dados[campo.name]) : dados[campo.name] ?? '';
    campo.disabled = oper === 'Re' || oper === 'De';
  }

  if (oper === 'Re') return;
  configurarEnvio(formulario, async dadosFormulario => {
    if (('areatotal' in dadosFormulario && Number(dadosFormulario.areatotal) <= 0) ||
        ('areausada' in dadosFormulario && Number(dadosFormulario.areausada) <= 0)) {
      throw new Error('Informe uma área maior que zero.');
    }
    let resposta;
    if (oper === 'Cr') resposta = await api.inserir(dadosFormulario);
    if (oper === 'Up') resposta = await api.atualizar(id, dadosFormulario);
    if (oper === 'De') resposta = await api.excluir(id);
    if (!(Number(resposta.linhasAfetadas) > 0)) {
      throw new Error('Nenhum registro foi alterado.');
    }
    window.location.assign('/' + modulo);
  });
  botao.disabled = false;
}

async function iniciar() {
  document.querySelector('#logout')?.addEventListener('click', sair);
  if (pagina === 'login') {
    configurarEnvio(document.querySelector('#login-form'), async credenciais => {
      const resultado = await requisitar('/Login', 'POST', credenciais);
      localStorage.setItem('token', resultado.token);
      window.location.replace('/');
    });
    return;
  }
  if (!token) {
    sair();
    return;
  }
  if (pagina === 'home') await carregarOcupacao();
  if (pagina === 'lista') await carregarLista();
  if (pagina === 'formulario') await carregarFormulario();
}

iniciar().catch(mostrarErro);
