const express = require('express');
const VotosController = require('../controller/votosController');
const router = express.Router();

const ctrl = new VotosController();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Votos']
    // #swagger.summary = 'Endpoint para listar todos os votos'
    ctrl.listar(req,res);
});

router.get('/obter/:num', (req,res) =>{
    // #swagger.tags = ['Votos']
    // #swagger.summary = 'Endpoint para obter um voto pelo número do candidato'
    ctrl.obter(req,res);
});

router.post('/gravar', (req,res) =>{
    // #swagger.tags = ['Votos']
    // #swagger.summary = 'Endpoint para gravar um voto'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/votos"
                    }
                }
            }
        }
    */
    ctrl.gravar(req,res);   
});

router.post('/gravar2', (req,res) =>{
    // #swagger.tags = ['Votos']
    // #swagger.summary = 'Endpoint para gravar um voto'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/votos"
                    }
                }
            }
        }
    */
    ctrl.gravar2(req,res);   
});

module.exports = router;
