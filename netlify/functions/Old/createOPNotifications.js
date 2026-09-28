const admin = require("./firebaseAdmin");

const db = admin.firestore();

exports.handler = async () => {
  try {
    console.log("🔔 Criando notificações de mudanças de OP...");

    const snapshot = await db.collection("opStatus").get();

    let criadas = 0;
    let ignoradas = 0;

    let batch = db.batch();
    let operacoesNoBatch = 0;

    const enviarBatch = async () => {
      if (operacoesNoBatch === 0) return;

      await batch.commit();

      console.log(`💾 Batch gravado com ${operacoesNoBatch} operação(ões).`);

      batch = db.batch();
      operacoesNoBatch = 0;
    };

    for (const doc of snapshot.docs) {
      const op = doc.data();

      // Primeira leitura da OP não gera notificação
      if (!op.etapaAnterior) {
        continue;
      }

      // Não houve mudança
      if (op.etapaAnterior === op.etapaAtual) {
        continue;
      }

      const notificacaoId = [
        op.empresaId,
        op.opId,
        op.opSeq,
        op.ultimoLancamentoId,
      ].join("_");

      const notificacaoRef = db.collection("notificacoesOP").doc(notificacaoId);

      const notificacaoSnapshot = await notificacaoRef.get();

      // Já existe essa notificação
      if (notificacaoSnapshot.exists) {
        ignoradas++;
        continue;
      }

      batch.set(notificacaoRef, {
        empresaId: op.empresaId,

        opId: op.opId,
        opSeq: op.opSeq,

        pedidoId: op.pedidoId,

        etapaAnterior: op.etapaAnterior,
        etapaAtual: op.etapaAtual,

        dataEtapaAtual: op.dataEtapaAtual,

        ultimoLancamentoId: op.ultimoLancamentoId,

        status: "pendente",

        criadoEm: admin.firestore.FieldValue.serverTimestamp(),

        enviadoEm: null,
      });

      criadas++;
      operacoesNoBatch++;

      if (operacoesNoBatch >= 450) {
        await enviarBatch();
      }
    }

    await enviarBatch();

    console.log("✅ Criação de notificações finalizada.");

    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sucesso: true,
        criadas,
        ignoradas,
      }),
    };
  } catch (error) {
    console.error("❌ Erro ao criar notificações:", error);

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
