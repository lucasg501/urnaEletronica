const VotosModel = require('../model/votosModel');

class VotosController {

    async listar(req,res){
        let votosModel = new VotosModel();
        let lista = await votosModel.listar();
        let listaRetorno = [];
        for (let i = 0; i < lista.length; i++) {
            listaRetorno.push(lista[i].toJSON());
        }
        res.status(200).json(listaRetorno);
    }

    async obter(req,res){
        if(req.params.idCand != null){
            let votosModel = new VotosModel();
            votosModel = await votosModel.obter(req.params.idCand);
            if(votosModel){
                res.status(200).json(votosModel.toJSON());
            } else {
                res.status(404).json({ message: "Voto não encontrado" });
            }
        }
    }

    async gravar(req,res){
        let votosModel = new VotosModel();

        votosModel.idCand = req.body.idCand;

        let ok = await votosModel.gravar();
        if(ok){
            res.status(201).json({ message: "Voto registrado com sucesso" });
        } else {
            res.status(500).json({ message: "Erro ao registrar voto" });
        }

    }

    async gravar2(req,res){
        let votosModel = new VotosModel();
        
        votosModel.idCand = req.body.idCand;

        let ok = await votosModel.gravar2();
        if(ok){
            res.status(201).json({ message: "Voto registrado com sucesso" });
        } else {
            res.status(500).json({ message: "Erro ao registrar voto" });
        }
    }

}

module.exports = VotosController;