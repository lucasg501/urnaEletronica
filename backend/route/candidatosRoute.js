const express = require('express');
const router = express.Router();
const candidatosController = require('../controller/candidatosController');

const ctrl = new candidatosController();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Candidatos']
    // #swagger.summary = 'Endpoint para listar todos os candidatos'
    ctrl.listar(req,res);
});

router.get('/obter/:num', (req,res) =>{
    // #swagger.tags = ['Candidatos']
    // #swagger.summary = 'Endpoint para obter um candidato pelo número'
    ctrl.obter(req,res);
});

module.exports = router;