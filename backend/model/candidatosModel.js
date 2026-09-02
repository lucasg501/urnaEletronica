const Database = require('../utils/database');
const banco = new Database();

class CandidatosModel{
    #idCand;
    #nome;
    #foto;
    #num;

    get idCand(){ return this.#idCand; } set idCand(idCand){ this.#idCand = idCand; }
    get nome(){ return this.#nome; } set nome(nome){ this.#nome = nome; }
    get foto(){ return this.#foto; } set foto(foto){ this.#foto = foto; }
    get num(){ return this.#num; } set num(num){ this.#num = num; }

    constructor(idCand, nome, foto, num){
        this.#idCand = idCand;
        this.#nome = nome;
        this.#foto = foto;
        this.#num = num;
    }

    toJSON(){
        return{
            'idCand': this.#idCand,
            'nome': this.#nome,
            'foto': this.#foto,
            'num': this.#num
        }
    }

    async listar(){
        let sql = 'select * from candidatos'
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for(let i = 0; i < rows.length; i++){
            lista.push(new CandidatosModel(rows[i].idCand, rows[i].nome, rows[i].foto, rows[i].num));
        }
        return lista;
    }

    async obter(num){
        let sql = 'select * from candidatos where num = ?';
        let valores = [num];
        let rows = await banco.ExecutaComando(sql, valores);
        if(rows.length > 0){
            return new CandidatosModel(rows[0].idCand, rows[0].nome, rows[0].foto, rows[0].num);
        }
    }

}

module.exports = CandidatosModel;