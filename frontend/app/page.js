"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const API = "http://localhost:4000";

export default function Home() {
  const [numero, setNumero] = useState("");
  const [candidato, setCandidato] = useState(null);

  const [votos, setVotos] = useState([]);
  const [candidatos, setCandidatos] = useState([]);

  const [mensagem, setMensagem] = useState("");
  const [modoGravacao, setModoGravacao] = useState("gravar");
  const [carregando, setCarregando] = useState(false);
  const [fotosReveladas, setFotosReveladas] = useState({});

  // ============================================================
  // CARREGAR CANDIDATOS
  // ============================================================

  async function carregarCandidatos() {
    try {
      const response = await fetch(`${API}/candidatos/listar`);

      if (!response.ok) {
        throw new Error("Erro ao carregar candidatos");
      }

      const dados = await response.json();

      setCandidatos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao carregar candidatos:", error);
    }
  }

  // ============================================================
  // CARREGAR VOTOS
  // ============================================================

  async function carregarVotos() {
    try {
      const response = await fetch(`${API}/votos/listar`);

      if (!response.ok) {
        throw new Error("Erro ao carregar votos");
      }

      const dados = await response.json();

      setVotos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao carregar votos:", error);
    }
  }

  // ============================================================
  // CARREGAMENTO INICIAL
  // ============================================================

  useEffect(() => {
    carregarCandidatos();
    carregarVotos();

    const intervalo = setInterval(() => {
      carregarVotos();
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  // ============================================================
  // DIGITAR NÚMERO
  // ============================================================

  function digitarNumero(numeroDigitado) {
    if (carregando) {
      return;
    }

    if (numero.length >= 2) {
      return;
    }

    setNumero((valorAtual) => valorAtual + numeroDigitado);
    setCandidato(null);
    setMensagem("");
  }

  // ============================================================
  // CORRIGIR
  // ============================================================

  function corrigir() {
    if (carregando) {
      return;
    }

    setNumero("");
    setCandidato(null);
    setMensagem("");
  }

  // ============================================================
  // BRANCO
  // ============================================================

  function votarBranco() {
    if (carregando) {
      return;
    }

    setNumero("");

    setCandidato({
      idCand: null,
      nome: "VOTO EM BRANCO",
      foto: null,
      num: null,
      branco: true
    });

    setMensagem("");
  }

  // ============================================================
  // BUSCAR CANDIDATO
  // ============================================================

  async function buscarCandidato() {
    if (!numero) {
      setMensagem("DIGITE O NÚMERO DO CANDIDATO");
      return;
    }

    try {
      setMensagem("CONSULTANDO...");

      const response = await fetch(
        `${API}/candidatos/obter/${numero}`
      );

      if (!response.ok) {
        throw new Error("Candidato não encontrado");
      }

      const dados = await response.json();

      /*
       * Dependendo de como seu controller retorna o objeto,
       * pode vir diretamente ou dentro de "dados".
       */
      const candidatoEncontrado = dados?.dados ?? dados;

      if (!candidatoEncontrado?.idCand) {
        throw new Error("Candidato inválido");
      }

      setCandidato(candidatoEncontrado);
      setMensagem("");
    } catch (error) {
      console.error(error);

      setCandidato(null);
      setMensagem("NÚMERO NÃO ENCONTRADO");
    }
  }

  // ============================================================
  // CONFIRMAR VOTO
  // ============================================================

  function tocarSomConfirmacao() {
    const audio = new Audio("/fim-som-da-urna.mp3");

    audio.play().catch((error) => {
      console.error("Não foi possível reproduzir o som:", error);
    });
  }

  function tocarSomConfirmacao() {
    let arquivoSom = "/fim-som-da-urna.mp3";

    if (Number(candidato?.num) === 13) {
      arquivoSom = "/fazl.mp3";
    }
    if(Number(candidato?.num) === 22){
      arquivoSom = "/bolsonaro.mp3";
    }
    if(Number(candidato?.num) === 29){
      arquivoSom = "/daciolo.mp3";
    }
    if(Number(candidato?.num) === 45){
      arquivoSom = "/german.mp3";
    }

    const audio = new Audio(arquivoSom);

    audio.play().catch((error) => {
      console.error("Não foi possível reproduzir o som:", error);
    });
  }

  async function confirmar() {
    if (carregando) {
      return;
    }

    /*
     * Se ainda não consultou o candidato,
     * consulta primeiro.
     */
    if (!candidato) {
      await buscarCandidato();
      return;
    }

    /*
     * Voto em branco
     */
    if (candidato.branco) {
      tocarSomConfirmacao();

      alert("VOTO EM BRANCO CONFIRMADO!");

      setNumero("");
      setCandidato(null);
      setMensagem("");

      return;
    }

    try {
      setCarregando(true);
      setMensagem("GRAVANDO VOTO...");

      const endpoint =
        modoGravacao === "gravar"
          ? "/votos/gravar"
          : "/votos/gravar2";

      const response = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          idCand: candidato.idCand
        })
      });

      if (!response.ok) {
        let detalhe = "";

        try {
          const erroBody = await response.json();

          detalhe = erroBody?.message
            ? ` (${erroBody.message})`
            : "";
        } catch (_) {
          // resposta sem corpo JSON, ignora
        }

        throw new Error(
          `Erro ao gravar voto [${response.status}]${detalhe}`
        );
      }

      // 🔊 SOM DA URNA
      tocarSomConfirmacao();

      alert(
        modoGravacao === "gravar"
          ? "VOTO CONFIRMADO!"
          : "VOTO GRAVADO PELO GRAVAR2!"
      );

      setNumero("");
      setCandidato(null);
      setMensagem("");

      await carregarVotos();

    } catch (error) {
      console.error(error);

      setMensagem(
        error?.message
          ? error.message.toUpperCase()
          : "ERRO AO GRAVAR O VOTO"
      );

    } finally {
      setCarregando(false);
    }
  }

  // ============================================================
  // ALTERAR MODO DE GRAVAÇÃO
  // ============================================================

  function alternarModoGravacao() {
    setModoGravacao((modoAtual) =>
      modoAtual === "gravar"
        ? "gravar2"
        : "gravar"
    );
  }

  // ============================================================
  // REVELAR/OCULTAR FOTO NA APURAÇÃO
  // ============================================================

  function alternarRevelarFoto(idCand) {
    setFotosReveladas((atual) => ({
      ...atual,
      [idCand]: !atual[idCand]
    }));
  }

  // ============================================================
  // CONTAGEM DOS VOTOS
  // ============================================================

  function obterContagem() {
    const totalVotos = votos.length;

    return candidatos
      .map((candidatoAtual) => {
        const quantidade = votos.filter(
          (voto) =>
            Number(voto.idCand) ===
            Number(candidatoAtual.idCand)
        ).length;

        const percentual =
          totalVotos > 0
            ? (quantidade / totalVotos) * 100
            : 0;

        return {
          ...candidatoAtual,
          quantidade,
          percentual
        };
      })
      .sort(
        (a, b) =>
          b.quantidade - a.quantidade
      );
  }

  const resultado = obterContagem();

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className={styles.container}>

      {/* ======================================================
          CONTROLE DO MODO
          ====================================================== */}

      <div className={styles.controleModo}>

        <span>
          Modo de gravação:
        </span>

        <strong>
          {modoGravacao.toUpperCase()}
        </strong>

        <button
          onClick={alternarModoGravacao}
          disabled={carregando}
        >
          ALTERAR PARA{" "}
          {modoGravacao === "gravar"
            ? "GRAVAR2"
            : "GRAVAR"}
        </button>

      </div>

      {/* ======================================================
          URNA
          ====================================================== */}

      <section className={styles.urna}>

        {/* TOPO */}

        <div className={styles.topoUrna}>

          <div className={styles.logoUrna}>
            URNA
            <span>ELETRÔNICA</span>
          </div>

          <div className={styles.indicador}>
            <span></span>
            SISTEMA DE VOTAÇÃO
          </div>

        </div>

        {/* CORPO */}

        <div className={styles.corpo}>

          {/* ==================================================
              TELA
              ================================================== */}

          <div className={styles.areaTela}>

            <div className={styles.tela}>

              <div className={styles.tituloTela}>
                VOTO PARA
              </div>

              <div className={styles.numeroDigitado}>
                {numero || " "}
              </div>

              <div className={styles.linha}></div>

              {candidato ? (

                candidato.branco ? (

                  <div className={styles.branco}>
                    VOTO EM BRANCO
                  </div>

                ) : (

                  <div className={styles.dadosCandidato}>

                    <div style={{width: "80%"}}>
                      <span>NOME:</span>
                      <strong>
                        {candidato.nome}
                      </strong>
                    </div>

                    <div>
                      <span>NÚMERO:</span>
                      <strong>
                        {candidato.num}
                      </strong>
                    </div>

                    {candidato.foto && (
                      <img
                        src={candidato.foto}
                        alt={candidato.nome}
                      />
                    )}

                  </div>

                )

              ) : (

                <div className={styles.instrucoes}>
                  DIGITE O NÚMERO
                  <br />
                  DO CANDIDATO
                </div>

              )}

              {mensagem && (
                <div className={styles.mensagem}>
                  {mensagem}
                </div>
              )}

              <div className={styles.rodapeTela}>
                <span>BRANCO</span>
                <span>CORRIGE</span>
                <span>CONFIRMA</span>
              </div>

            </div>

          </div>

          {/* ==================================================
              TECLADO
              ================================================== */}

          <div className={styles.teclado}>

            <div className={styles.botoesNumericos}>

              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "0"
              ].map((numeroBotao) => (

                <button
                  key={numeroBotao}
                  className={styles.botaoNumero}
                  onClick={() =>
                    digitarNumero(numeroBotao)
                  }
                >
                  {numeroBotao}
                </button>

              ))}

            </div>

            <div className={styles.botoesAcao}>

              <button
                className={`${styles.botaoAcao} ${styles.brancoBotao}`}
                onClick={votarBranco}
              >
                BRANCO
              </button>

              <button
                className={`${styles.botaoAcao} ${styles.corrigeBotao}`}
                onClick={corrigir}
              >
                CORRIGE
              </button>

              <button
                className={`${styles.botaoAcao} ${styles.confirmaBotao}`}
                onClick={confirmar}
                disabled={carregando}
              >
                CONFIRMA
              </button>

            </div>

          </div>

        </div>

        {/* BASE */}

        <div className={styles.baseUrna}>
          <div></div>
          <div></div>
          <div></div>
        </div>

      </section>

      {/* ======================================================
          APURAÇÃO
          ====================================================== */}

      <section className={styles.apuracao}>

        <div className={styles.tituloApuracao}>

          <div>
            APURAÇÃO DOS VOTOS
          </div>

          <button
            className={styles.atualizar}
            onClick={() => {
              carregarCandidatos();
              carregarVotos();
            }}
          >
            ↻ ATUALIZAR
          </button>

        </div>

        <div className={styles.totalVotos}>
          TOTAL DE VOTOS:

          <strong>
            {votos.length}
          </strong>
        </div>

        {resultado.length === 0 ? (

          <div className={styles.semVotos}>
            Nenhum candidato cadastrado.
          </div>

        ) : (

          <div style={{ color: "black" }} className={styles.listaVotos}>

            {resultado.map((candidatoAtual) => (

              <div
                className={styles.votoCard}
                key={candidatoAtual.idCand}
              >

                <div className={styles.infoResultado}>

                  {candidatoAtual.foto && (
                    <div className={styles.fotoWrapper}>

                      <img
                        src={candidatoAtual.foto}
                        alt={candidatoAtual.nome}
                        className={
                          Number(candidatoAtual.idCand) === 3 &&
                            !fotosReveladas[candidatoAtual.idCand]
                            ? styles.fotoDistorcida
                            : undefined
                        }
                      />

                      {Number(candidatoAtual.idCand) === 3 && (
                        <button
                          type="button"
                          className={styles.botaoRevelarFoto}
                          onClick={() =>
                            alternarRevelarFoto(candidatoAtual.idCand)
                          }
                        >
                          {fotosReveladas[candidatoAtual.idCand]
                            ? "OCULTAR FOTO"
                            : "MOSTRAR FOTO"}
                        </button>
                      )}

                    </div>
                  )}

                  <div>

                    <span>
                      NÚMERO
                    </span>

                    <strong>
                      {candidatoAtual.num}
                    </strong>

                    <p>
                      {candidatoAtual.num == 45 ? "N/A" : candidatoAtual.nome}
                    </p>

                  </div>

                </div>

                <div className={styles.quantidade}>

                  {candidatoAtual.quantidade}

                  <small>
                    {candidatoAtual.quantidade === 1
                      ? "VOTO"
                      : "VOTOS"}
                  </small>

                  <span className={styles.percentual}>
                    {candidatoAtual.percentual.toFixed(1)}%
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}