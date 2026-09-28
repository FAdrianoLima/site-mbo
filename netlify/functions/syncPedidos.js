const axios = require("axios");
const admin = require("./firebaseAdmin");

const db = admin.firestore();
const { FieldValue } = admin.firestore;

exports.handler = async () => {
  try {
    console.log("🔄 Iniciando sincronização de pedidos...");

    const response = await axios.get(process.env.COSMOS_PEDIDOS_URL);
    const pedidos = response.data;

    if (!Array.isArray(pedidos)) {
      throw new Error("O CosmosERP não retornou uma lista de pedidos.");
    }

    console.log(`📦 Pedidos recebidos: ${pedidos.length}`);

    const snapshot = await db.collection("pedidos").get();

    const pedidosExistentes = new Map();

    snapshot.forEach((doc) => {
      pedidosExistentes.set(doc.id, doc.data());
    });

    let novos = 0;
    let atualizados = 0;
    let semAlteracao = 0;

    let batch = db.batch();
    let operacoesNoBatch = 0;

    const enviarBatch = async () => {
      if (operacoesNoBatch === 0) return;

      await batch.commit();

      console.log(`💾 Batch gravado com ${operacoesNoBatch} operação(ões).`);

      batch = db.batch();
      operacoesNoBatch = 0;
    };

    for (const pedido of pedidos) {
      if (!pedido.PedidoId) continue;

      const id = String(pedido.PedidoId);
      const existente = pedidosExistentes.get(id);

      const dados = {
        empresaId: pedido.EmpresaID || null,
        cosmosPedidoId: pedido.PedidoId,
        pessoaId: pedido.PessoaId || null,
        numeroSolicitacao: pedido.PedidoNroSolic || "",
        valorTotal: Number(pedido.PedidoVlTotal || 0),
        situacao: pedido.PedidoSituacao || "",
      };

      // PEDIDO NOVO
      if (!existente) {
        const ref = db.collection("pedidos").doc(id);

        batch.set(ref, {
          ...dados,
          criadoEm: FieldValue.serverTimestamp(),
          atualizadoEm: FieldValue.serverTimestamp(),
        });

        novos++;
        operacoesNoBatch++;
      }

      // PEDIDO EXISTENTE
      else {
        const mudou =
          existente.empresaId !== dados.empresaId ||
          existente.pessoaId !== dados.pessoaId ||
          existente.numeroSolicitacao !== dados.numeroSolicitacao ||
          existente.valorTotal !== dados.valorTotal ||
          existente.situacao !== dados.situacao;

        if (!mudou) {
          semAlteracao++;
          continue;
        }

        const ref = db.collection("pedidos").doc(id);

        batch.update(ref, {
          ...dados,
          atualizadoEm: FieldValue.serverTimestamp(),
        });

        atualizados++;
        operacoesNoBatch++;
      }

      // Mantemos abaixo do limite de 500 operações do Firestore
      if (operacoesNoBatch >= 450) {
        await enviarBatch();
      }
    }

    await enviarBatch();

    console.log("✅ Sincronização de pedidos finalizada.");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sucesso: true,
        encontrados: pedidos.length,
        novos,
        atualizados,
        semAlteracao,
      }),
    };
  } catch (error) {
    console.error("❌ Erro ao sincronizar pedidos:", error);

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
