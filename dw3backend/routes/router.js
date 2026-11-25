const express = require('express');
const appLogin = require('../apps/login/controller/ctlLogin');
const ctlPastos = require('../apps/pastos/controller/ctlPastos');
const ctlPiquetes = require('../apps/piquetes/controller/ctlPiquetes');
const ctlAnimais = require('../apps/animais/controller/ctlAnimais');
const ctlAlocados = require('../apps/alocados/controller/ctlAlocados');

const routerApp = express.Router();

routerApp.get('/', (req, res) => res.send('Servidor DW3'));
routerApp.post('/Login', appLogin.Login);

// Rotas de Pastos
routerApp.get('/getAllPastos', appLogin.AutenticaJWT, ctlPastos.GetAllPastos);
routerApp.get('/getPastoByID/:id', appLogin.AutenticaJWT, ctlPastos.GetPastoByID);
routerApp.post('/insertPasto', appLogin.AutenticaJWT, ctlPastos.InsertPasto);
routerApp.put('/updatePasto/:id', appLogin.AutenticaJWT, ctlPastos.UpdatePasto);
routerApp.delete('/deletePasto/:id', appLogin.AutenticaJWT, ctlPastos.DeletePasto);

// Rotas de Piquetes
routerApp.get('/getAllPiquetes', appLogin.AutenticaJWT, ctlPiquetes.GetAllPiquetes);
routerApp.get('/getPiqueteByID/:id', appLogin.AutenticaJWT, ctlPiquetes.GetPiqueteByID);
routerApp.post('/insertPiquete', appLogin.AutenticaJWT, ctlPiquetes.InsertPiquete);
routerApp.put('/updatePiquete/:id', appLogin.AutenticaJWT, ctlPiquetes.UpdatePiquete);
routerApp.delete('/deletePiquete/:id', appLogin.AutenticaJWT, ctlPiquetes.DeletePiquete);

// Rotas de Animais
routerApp.get('/getAllAnimais', appLogin.AutenticaJWT, ctlAnimais.GetAllAnimais);
routerApp.get('/getAnimalByID/:id', appLogin.AutenticaJWT, ctlAnimais.GetAnimalByID);
routerApp.post('/insertAnimal', appLogin.AutenticaJWT, ctlAnimais.InsertAnimal);
routerApp.put('/updateAnimal/:id', appLogin.AutenticaJWT, ctlAnimais.UpdateAnimal);
routerApp.delete('/deleteAnimal/:id', appLogin.AutenticaJWT, ctlAnimais.DeleteAnimal);

// Rotas de Alocados
routerApp.get('/getAllAlocados', appLogin.AutenticaJWT, ctlAlocados.GetAllAlocados);
routerApp.get('/getAlocadoByID/:id', appLogin.AutenticaJWT, ctlAlocados.GetAlocadoByID);
routerApp.post('/insertAlocado', appLogin.AutenticaJWT, ctlAlocados.InsertAlocado);
routerApp.put('/updateAlocado/:id', appLogin.AutenticaJWT, ctlAlocados.UpdateAlocado);
routerApp.delete('/deleteAlocado/:id', appLogin.AutenticaJWT, ctlAlocados.DeleteAlocado);

module.exports = routerApp;
