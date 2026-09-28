const axios = require("axios");
const admin = require("./firebaseAdmin");

const db = admin.firestore();
const { FieldValue } = admin.firestore;

exports.handler = async () => {
  try {
    console.log("🔄 Iniciando sincronização de OPs...");

    const response = await axios.get(process.env.COSMOS_OP_EVENTOS_URL);

    const lancamentos = response.data;

    if (!Array.isArray(lancamentos)) {
      throw new Error(
        "O CosmosERP não retornou uma lista de lançamentos de OP.",
      );
    }

    console.log(`📦 Lançamentos recebidos: ${lancamentos.length}`);

    // ============================================================
    // 1. AGRUPAR LANÇAMENTOS POR OP
    // ============================================================

    const ops = new Map();

    for (const lancamento of lancamentos) {
      if (
        lancamento.OPEmpresaID == null ||
        lancamento.OPId == null ||
        lancamento.OPSeq == null
      ) {
        continue;
      }

      const chave = [
        lancamento.OPEmpresaID,
        lancamento.OPId,
        lancamento.OPSeq,
      ].join("_");

      if (!ops.has(chave)) {
        ops.set(chave, []);
      }

      ops.get(chave).push(lancamento);
    }

    console.log(`🔧 OPs encontradas: ${ops.size}`);

    // ============================================================
    // 2. BUSCAR OPs JÁ SALVAS
    // ============================================================

    const snapshot = await db.collection("opStatus").get();

    const opsExistentes = new Map();

    snapshot.forEach((doc) => {
      opsExistentes.set(doc.id, doc.data());
    });

    // ============================================================
    // 3. PREPARAR BATCH
    // ============================================================

    let batch = db.batch();
    let operacoesNoBatch = 0;

    let novas = 0;
    let atualizadas = 0;
    let semAlteracao = 0;

    const enviarBatch = async () => {
      if (operacoesNoBatch === 0) return;

      await batch.commit();

      console.log(`💾 Batch gravado com ${operacoesNoBatch} operação(ões).`);

      batch = db.batch();
      operacoesNoBatch = 0;
    };

    // ============================================================
    // 4. PROCESSAR CADA OP
    // ============================================================

    for (const [chave, registros] of ops.entries()) {
      // ----------------------------------------------------------
      // Ordenar os lançamentos
      //
      // Primeiro: data/hora
      // Em caso de empate: OPLanctoId
      // ----------------------------------------------------------

      registros.sort((a, b) => {
        const dataA = new Date(a.OPLanctoDataHora || 0).getTime();

        const dataB = new Date(b.OPLanctoDataHora || 0).getTime();

        if (dataA !== dataB) {
          return dataA - dataB;
        }

        return Number(a.OPLanctoId || 0) - Number(b.OPLanctoId || 0);
      });

      const ultimo = registros[registros.length - 1];

      const id = chave;

      const existente = opsExistentes.get(id);

      const dados = {
        empresaId: ultimo.OPEmpresaID,
        opId: ultimo.OPId,
        opSeq: ultimo.OPSeq,
        pedidoId: ultimo.PedidoId || null,

        ultimoLancamentoId: ultimo.OPLanctoId || null,

        etapaAtual: ultimo.EAPEtapaDesc || "",

        dataEtapaAtual: ultimo.OPLanctoDataHora || "",

        situacaoAtual: ultimo.Situacao || "",

        quantidadeLancamentos: registros.length,
      };

      // ==========================================================
      // OP NOVA
      // ==========================================================

      if (!existente) {
        const ref = db.collection("opStatus").doc(id);

        batch.set(ref, {
          ...dados,

          etapaAnterior: null,

          criadoEm: FieldValue.serverTimestamp(),

          atualizadoEm: FieldValue.serverTimestamp(),
        });

        novas++;
        operacoesNoBatch++;
      }

      // ==========================================================
      // OP EXISTENTE
      // ==========================================================
      else {
        const mudou =
          existente.ultimoLancamentoId !== dados.ultimoLancamentoId ||
          existente.etapaAtual !== dados.etapaAtual ||
          existente.dataEtapaAtual !== dados.dataEtapaAtual ||
          existente.situacaoAtual !== dados.situacaoAtual;

        if (!mudou) {
          semAlteracao++;
          continue;
        }

        const ref = db.collection("opStatus").doc(id);

        batch.update(ref, {
          ...dados,

          etapaAnterior: existente.etapaAtual || null,

          atualizadoEm: FieldValue.serverTimestamp(),
        });

        atualizadas++;
        operacoesNoBatch++;
      }

      // ==========================================================
      // LIMITE DO BATCH
      // ==========================================================

      if (operacoesNoBatch >= 450) {
        await enviarBatch();
      }
    }

    // ============================================================
    // 5. ENVIAR ÚLTIMO BATCH
    // ============================================================

    await enviarBatch();

    console.log("✅ Sincronização de OPs finalizada.");

    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sucesso: true,

        lancamentosRecebidos: lancamentos.length,

        opsEncontradas: ops.size,

        novas,

        atualizadas,

        semAlteracao,
      }),
    };
  } catch (error) {
    console.error("❌ Erro ao sincronizar OPs:", error);

    return {
      statusCode: 500,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sucesso: false,
        erro: error.message,
      }),
    };
  }
};
