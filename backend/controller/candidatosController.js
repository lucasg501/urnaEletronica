const CandidadosModel = require('../model/candidatosModel');

class CandidatosController{
    async listar(req,res){
        let candidadosModel = new CandidadosModel();
        let lista = await candidadosModel.listar();
        let listaRetorno = [];
        for(let i = 0; i < lista.length; i++){
            listaRetorno.push(lista[i].toJSON());
        }
        res.status(200).json(listaRetorno);
    }

    async obter(req,res){
        if(req.params.num != null){
            let candidadosModel = new CandidadosModel();
            candidadosModel = await candidadosModel.obter(req.params.num);
            if(candidadosModel){
                res.status(200).json(candidadosModel.toJSON());
            } else {
                res.status(404).json({ message: "Candidato não encontrado" });
            }
        }
        
    }
}

module.exports = CandidatosController;