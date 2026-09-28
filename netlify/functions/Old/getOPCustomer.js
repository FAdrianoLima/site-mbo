const admin = require("./firebaseAdmin");

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const opId = event.queryStringParameters?.opId;

    if (!opId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          sucesso: false,
          erro: "Informe o opId.",
        }),
      };
    }

    console.log(`🔎 Buscando OP ${opId}...`);

    // 1. Buscar OP
    const opSnapshot = await db
      .collection("opStatus")
      .where("opId", "==", Number(opId))
      .limit(1)
      .get();

    if (opSnapshot.empty) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          sucesso: false,
          erro: `OP ${opId} não encontrada.`,
        }),
      };
    }

    const opDoc = opSnapshot.docs[0];
    const op = opDoc.data();

    console.log(`📋 OP encontrada: ${opDoc.id}`);

    // 2. Buscar pedido
    if (!op.pedidoId) {
      throw new Error(`A OP ${opId} não possui pedidoId.`);
    }

    const pedidoRef = db.collection("pedidos").doc(String(op.pedidoId));

    const pedidoSnapshot = await pedidoRef.get();

    if (!pedidoSnapshot.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          sucesso: false,
          erro: `Pedido ${op.pedidoId} não encontrado.`,
        }),
      };
    }

    const pedido = pedidoSnapshot.data();

    console.log(`📦 Pedido encontrado: ${op.pedidoId}`);

    // 3. Buscar cliente
    if (!pedido.pessoaId) {
      throw new Error(`O pedido ${op.pedidoId} não possui pessoaId.`);
    }

    const clienteRef = db.collection("clientes").doc(String(pedido.pessoaId));

    const clienteSnapshot = await clienteRef.get();

    if (!clienteSnapshot.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          sucesso: false,
          erro: `Cliente ${pedido.pessoaId} não encontrado.`,
        }),
      };
    }

    const cliente = clienteSnapshot.data();

    console.log(`👤 Cliente encontrado: ${pedido.pessoaId}`);

    // 4. Resultado final
    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sucesso: true,

        op: {
          id: opDoc.id,
          opId: op.opId,
          opSeq: op.opSeq,
          etapaAtual: op.etapaAtual,
          etapaAnterior: op.etapaAnterior,
        },

        pedido: {
          pedidoId: pedido.cosmosPedidoId,
          numeroSolicitacao: pedido.numeroSolicitacao,
          pessoaId: pedido.pessoaId,
          situacao: pedido.situacao,
        },

        cliente: {
          pessoaId: pedido.pessoaId,
          razaoSocial: cliente.razaoSocial,
          nomeFantasia: cliente.nomeFantasia,
          telefone: cliente.telefone,
          ddd: cliente.ddd,
          email: cliente.email,
        },
      }),
    };
  } catch (error) {
    console.error("❌ Erro ao buscar cliente da OP:", error);

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
