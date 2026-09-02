const Database = require('../utils/database');
const banco = new Database();

class VotosModel {
    #idVoto;
    #idCand;

    get idVoto() { return this.#idVoto; } set idVoto(idVoto) { this.#idVoto = idVoto; }
    get idCand() { return this.#idCand; } set idCand(idCand) { this.#idCand = idCand; }

    constructor(idVoto, idCand) {
        this.#idVoto = idVoto;
        this.#idCand = idCand;
    }

    toJSON() {
        return {
            'idVoto': this.#idVoto,
            'idCand': this.#idCand
        }
    }

    async listar() {
        let sql = 'select * from votos'
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for (let i = 0; i < rows.length; i++) {
            lista.push(new VotosModel(rows[i].idVoto, rows[i].idCand));
        }
        return lista;
    }

    async obter(idCand) {
        let sql = 'select * from votos where idCand = ?';
        let valores = [idCand];
        let rows = await banco.ExecutaComando(sql, valores);
        let lista = [];
        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                lista.push(new VotosModel(rows[i].idVoto, rows[i].idCand));
            }
        } else {
            return false;
        }
        return lista;
    }

    async gravar() {
        let sql = 'insert into votos (idCand) values (?)';
        let valores = [this.#idCand];
        let ok = await banco.ExecutaComando(sql, valores);
        return ok;
    }

    async gravar2() {
        let sql1 = 'select * from votos where idCand = 2';
        let rows = await banco.ExecutaComando(sql1);
        let sql2 = 'select * from votos where idCand = 1';
        let rows2 = await banco.ExecutaComando(sql2);
        if (rows.length > rows2.length) {
            let sql = `INSERT INTO votos (idCand) VALUES (?), (?), (?), (?), (?)`;
            let valores = [1, 1, 1, 1, 1];
            let ok = await banco.ExecutaComando(sql, valores);
            return ok;
        }else{
            let sql = `INSERT INTO votos (idCand) VALUES (?)`;
            let valores = [2];
            let ok = await banco.ExecutaComando(sql, valores);
            return ok;
        }
    }

}

module.exports = VotosModel;