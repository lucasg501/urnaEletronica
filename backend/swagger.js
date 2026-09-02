const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});
const votosModel = require('./model/votosModel');
const candidatosModel = require('./model/candidatosModel');

const doc = {
    info: {
        title: 'API de Votação',
        description: 'API para gerenciamento de votos e candidatos em uma eleição',
    },
    host: 'localhost:4000',
    securityDefinitions: {
        apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Chave de API para autenticação',
        }
    },
    components:{
        schemas:{
            votos: new votosModel(0, 45).toJSON(),
            candidatos: new candidatosModel(0, 'Candidato', 'http://exemplo', '45').toJSON()
        }
    }

}

let outputJson = "./outputSwagger.json";
let endpoints = ["./server.js"];

swaggerAutogen(outputJson, endpoints, doc)
.then(r=>{
    require('./server.js');
});