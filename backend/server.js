const express = require('express');
const cors = require('cors');
const swaggerJson = require('./outputSwagger.json');
const swaggerUi = require('swagger-ui-express');
const votosRoute = require('./route/votosRoute');
const candidatosRoute = require('./route/candidatosRoute');

const app = express();
const porta = 4000;

app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use(express.json());
app.use('/votos', votosRoute);
app.use('/candidatos', candidatosRoute);

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
    console.log('Acesse a documentação em http://localhost:4000/docs');
});