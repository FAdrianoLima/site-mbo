const admin = require("./firebaseAdmin");

const db = admin.firestore();

exports.handler = async () => {
  try {
    console.log("🔎 Verificando mudanças de etapa das OPs...");

    const snapshot = await db.collection("opStatus").get();

    let mudanças = [];

    snapshot.forEach((doc) => {
      const op = doc.data();

      // Primeira leitura da OP não é considerada mudança
      if (!op.etapaAnterior) {
        return;
      }

      // Não houve mudança real
      if (op.etapaAnterior === op.etapaAtual) {
        return;
      }

      mudanças.push({
        id: doc.id,

        empresaId: op.empresaId,
        opId: op.opId,
        opSeq: op.opSeq,

        pedidoId: op.pedidoId,

        etapaAnterior: op.etapaAnterior,
        etapaAtual: op.etapaAtual,

        dataEtapaAtual: op.dataEtapaAtual,

        ultimoLancamentoId: op.ultimoLancamentoId,
      });
    });

    console.log(`🔄 Mudanças encontradas: ${mudanças.length}`);

    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sucesso: true,
        quantidade: mudanças.length,
        mudanças,
      }),
    };
  } catch (error) {
    console.error("❌ Erro ao detectar mudanças:", error);

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
