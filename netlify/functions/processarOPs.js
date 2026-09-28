const admin = require("./firebaseAdmin");

const db = admin.firestore();

exports.handler = async () => {
  try {
    console.log("🔄 Iniciando processamento das OPs...");

    const snapshot = await db.collection("opStatus").get();

    console.log(`📦 OPs encontradas: ${snapshot.size}`);

    let verificadas = 0;
    let comMudanca = 0;
    let semPedido = 0;
    let semCliente = 0;

    const alteracoes = [];

    // ============================================================
    // 1. ENCONTRAR OPs QUE TIVERAM MUDANÇA DE ETAPA
    // ============================================================

    for (const doc of snapshot.docs) {
      verificadas++;

      const op = doc.data();

      // Primeira sincronização da OP
      if (!op.etapaAnterior) {
        continue;
      }

      // Não houve mudança de etapa
      if (op.etapaAnterior === op.etapaAtual) {
        continue;
      }

      comMudanca++;

      console.log(`🔄 OP ${op.opId}: ${op.etapaAnterior} → ${op.etapaAtual}`);

      // ==========================================================
      // 2. BUSCAR PEDIDO
      // ==========================================================

      if (!op.pedidoId) {
        console.log(`⚠️ OP ${op.opId} não possui pedido.`);
        semPedido++;
        continue;
      }

      const pedidoSnapshot = await db
        .collection("pedidos")
        .doc(String(op.pedidoId))
        .get();

      if (!pedidoSnapshot.exists) {
        console.log(`⚠️ Pedido ${op.pedidoId} não encontrado.`);
        semPedido++;
        continue;
      }

      const pedido = pedidoSnapshot.data();

      // ==========================================================
      // 3. BUSCAR CLIENTE
      // ==========================================================

      if (!pedido.pessoaId) {
        console.log(`⚠️ Pedido ${op.pedidoId} não possui pessoaId.`);

        semCliente++;
        continue;
      }

      const clienteSnapshot = await db
        .collection("clientes")
        .doc(String(pedido.pessoaId))
        .get();

      if (!clienteSnapshot.exists) {
        console.log(`⚠️ Cliente ${pedido.pessoaId} não encontrado.`);

        semCliente++;
        continue;
      }

      const cliente = clienteSnapshot.data();

      // ==========================================================
      // 4. DEFINIR CÓDIGO DO CLIENTE
      //
      // Atualmente o syncClientes salva o PessoaID como
      // cosmosPessoaId. Portanto esse será o código do cliente.
      // ==========================================================

      const codigoCliente = cliente.cosmosPessoaId || pedido.pessoaId;

      // ==========================================================
      // 5. DEFINIR CÓDIGO DO PEDIDO
      //
      // Primeiro tenta o número da solicitação.
      // Se não existir, usa o PedidoId do Cosmos.
      // ==========================================================

      const codigoPedido =
        pedido.numeroSolicitacao ||
        pedido.cosmosPedidoId ||
        pedido.pedidoId ||
        op.pedidoId;

      alteracoes.push({
        opDocId: doc.id,

        empresaId: op.empresaId,

        opId: op.opId,

        opSeq: op.opSeq,

        pedidoId: op.pedidoId,

        pessoaId: pedido.pessoaId,

        codigoCliente,

        codigoPedido,

        clienteNome: cliente.nomeFantasia || cliente.razaoSocial || "Cliente",

        clienteRazaoSocial: cliente.razaoSocial || "",

        ddd: cliente.ddd || "",

        telefone: cliente.telefone || "",

        email: cliente.email || "",

        etapaAnterior: op.etapaAnterior,

        etapaAtual: op.etapaAtual,

        dataEtapaAtual: op.dataEtapaAtual,

        ultimoLancamentoId: op.ultimoLancamentoId,
      });
    }

    console.log(`📋 Alterações de OP encontradas: ${alteracoes.length}`);

    // ============================================================
    // 6. AGRUPAR TODAS AS ALTERAÇÕES POR CLIENTE
    // ============================================================

    const gruposClientes = new Map();

    for (const alteracao of alteracoes) {
      const chaveCliente = String(alteracao.pessoaId);

      if (!gruposClientes.has(chaveCliente)) {
        gruposClientes.set(chaveCliente, {
          pessoaId: alteracao.pessoaId,

          codigoCliente: alteracao.codigoCliente,

          clienteNome: alteracao.clienteNome,

          clienteRazaoSocial: alteracao.clienteRazaoSocial,

          ddd: alteracao.ddd,

          telefone: alteracao.telefone,

          email: alteracao.email,

          itens: [],
        });
      }

      gruposClientes.get(chaveCliente).itens.push(alteracao);
    }

    console.log(
      `👥 Clientes que receberão notificações: ${gruposClientes.size}`,
    );

    // ============================================================
    // 7. CRIAR UMA NOTIFICAÇÃO POR CLIENTE
    // ============================================================

    let notificacoesCriadas = 0;
    let notificacoesExistentes = 0;

    let batch = db.batch();
    let operacoesNoBatch = 0;

    const enviarBatch = async () => {
      if (operacoesNoBatch === 0) return;

      await batch.commit();

      console.log(`💾 Batch gravado com ${operacoesNoBatch} operação(ões).`);

      batch = db.batch();
      operacoesNoBatch = 0;
    };

    for (const [pessoaId, grupo] of gruposClientes.entries()) {
      // ==========================================================
      // CRIAR ID ÚNICO DA NOTIFICAÇÃO
      //
      // Cada alteração de OP entra no identificador.
      // Assim evitamos criar novamente a mesma notificação.
      // ==========================================================

      const identificadores = grupo.itens
        .map(
          (item) =>
            `${item.empresaId}_${item.opId}_${item.opSeq}_${item.ultimoLancamentoId}`,
        )
        .sort();

      const notificacaoId = `${pessoaId}_` + identificadores.join("__");

      const notificacaoRef = db.collection("notificacoesOP").doc(notificacaoId);

      const notificacaoSnapshot = await notificacaoRef.get();

      if (notificacaoSnapshot.exists) {
        notificacoesExistentes++;

        console.log(`ℹ️ Notificação já existe para cliente ${pessoaId}.`);

        continue;
      }

      // ==========================================================
      // CRIAR NOTIFICAÇÃO AGRUPADA
      // ==========================================================

      batch.set(notificacaoRef, {
        pessoaId,

        codigoCliente: grupo.codigoCliente,

        clienteNome: grupo.clienteNome,

        clienteRazaoSocial: grupo.clienteRazaoSocial,

        ddd: grupo.ddd,

        telefone: grupo.telefone,

        email: grupo.email,

        quantidadeItens: grupo.itens.length,

        itens: grupo.itens.map((item) => ({
          empresaId: item.empresaId,

          opId: item.opId,

          opSeq: item.opSeq,

          pedidoId: item.pedidoId,

          codigoPedido: item.codigoPedido,

          etapaAnterior: item.etapaAnterior,

          etapaAtual: item.etapaAtual,

          dataEtapaAtual: item.dataEtapaAtual,

          ultimoLancamentoId: item.ultimoLancamentoId,
        })),

        status: "pendente",

        criadoEm: admin.firestore.FieldValue.serverTimestamp(),

        enviadoEm: null,

        atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
      });

      notificacoesCriadas++;

      operacoesNoBatch++;

      if (operacoesNoBatch >= 450) {
        await enviarBatch();
      }
    }

    await enviarBatch();

    console.log("✅ Processamento das OPs finalizado.");

    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sucesso: true,

        verificadas,

        comMudanca,

        alteracoesEncontradas: alteracoes.length,

        clientesAgrupados: gruposClientes.size,

        notificacoesCriadas,

        notificacoesExistentes,

        semPedido,

        semCliente,
      }),
    };
  } catch (error) {
    console.error("❌ Erro ao processar OPs:", error);

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
