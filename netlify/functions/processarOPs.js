const admin = require("./firebaseAdmin");

const db = admin.firestore();

const { FieldValue } = admin.firestore;

// ============================================================
// NORMALIZAR TEXTO
// ============================================================

function normalizarTexto(texto) {
  return String(texto || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

// ============================================================
// IDENTIFICAR MACROSTATUS
// ============================================================

function identificarMacroStatus(etapa) {
  const texto = normalizarTexto(etapa);

  if (!texto) {
    return null;
  }

  // DISPONÍVEL PARA ENTREGA
  if (texto === "DISPONIVEL P/ENTREGA" || texto === "DISPONIVEL PARA ENTREGA") {
    return "disponivel_entrega";
  }

  // EXPEDIÇÃO
  if (texto === "EXPEDICAO") {
    return "expedicao";
  }

  // LOGÍSTICA
  if (texto === "LOGISTICA") {
    return "logistica";
  }

  // ENTREGUE
  if (texto === "ENTREGUE") {
    return "entregue";
  }

  // Todo o restante é considerado PRODUÇÃO
  return "producao";
}

// ============================================================
// TEXTO DA MENSAGEM
// ============================================================

function textoMacroStatus(macroStatus) {
  switch (macroStatus) {
    case "producao":
      return "Seu pedido entrou em nosso processo de produção.";

    case "expedicao":
      return "Seu pedido está em processo de expedição.";

    case "disponivel_entrega":
      return "Seu pedido está disponível para entrega.";

    case "logistica":
      return "Seu pedido está em processo de logística.";

    case "entregue":
      return "Seu pedido foi entregue.";

    default:
      return "Seu pedido teve uma atualização.";
  }
}

// ============================================================
// HANDLER
// ============================================================

exports.handler = async () => {
  try {
    console.log("🔄 Iniciando processamento das OPs...");

    const snapshot = await db.collection("opStatus").get();

    console.log(`📦 OPs encontradas: ${snapshot.size}`);

    let verificadas = 0;
    let comMudanca = 0;
    let fasesNovas = 0;
    let fasesJaNotificadas = 0;
    let notificacoesExistentes = 0;
    let semPedido = 0;
    let semCliente = 0;

    const alteracoes = [];

    // ========================================================
    // 1. ENCONTRAR OPs COM MUDANÇA
    // ========================================================

    for (const doc of snapshot.docs) {
      verificadas++;

      const op = doc.data();

      // Primeira sincronização da OP
      if (!op.etapaAnterior) {
        continue;
      }

      // Não houve mudança
      if (op.etapaAnterior === op.etapaAtual) {
        continue;
      }

      comMudanca++;

      console.log(`🔄 OP ${op.opId}: ${op.etapaAnterior} → ${op.etapaAtual}`);

      // ======================================================
      // IDENTIFICAR MACROSTATUS
      // ======================================================

      const macroStatus = identificarMacroStatus(op.etapaAtual);

      if (!macroStatus) {
        continue;
      }

      console.log(`📌 OP ${op.opId}: macrostatus = ${macroStatus}`);

      // ======================================================
      // VERIFICAR SE A FASE JÁ FOI NOTIFICADA
      // ======================================================

      const fasesNotificadas = op.fasesNotificadas || {};

      if (fasesNotificadas[macroStatus]) {
        console.log(
          `ℹ️ OP ${op.opId}: fase "${macroStatus}" já foi notificada.`,
        );

        fasesJaNotificadas++;
        continue;
      }

      // ======================================================
      // BUSCAR PEDIDO
      // ======================================================

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

      // ======================================================
      // BUSCAR CLIENTE
      // ======================================================

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

      // ======================================================
      // CÓDIGO DO PEDIDO
      // ======================================================

      const codigoPedido =
        pedido.numeroSolicitacao ||
        pedido.cosmosPedidoId ||
        pedido.pedidoId ||
        op.pedidoId;

      // ======================================================
      // ADICIONAR ALTERAÇÃO
      // ======================================================

      alteracoes.push({
        opDocId: doc.id,

        empresaId: op.empresaId,
        opId: op.opId,
        opSeq: op.opSeq,

        pedidoId: op.pedidoId,
        pessoaId: pedido.pessoaId,

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

        macroStatus,
        textoStatus: textoMacroStatus(macroStatus),

        // NOVO: previsão de entrega
        dataEntrega: pedido.dataEntrega || null,
      });

      fasesNovas++;
    }

    console.log(`📋 Alterações encontradas: ${alteracoes.length}`);

    console.log(`🆕 Novas fases: ${fasesNovas}`);

    console.log(`ℹ️ Fases já notificadas: ${fasesJaNotificadas}`);

    // ========================================================
    // 2. AGRUPAR POR CLIENTE
    // ========================================================

    const gruposClientes = new Map();

    for (const alteracao of alteracoes) {
      const chaveCliente = String(alteracao.pessoaId);

      if (!gruposClientes.has(chaveCliente)) {
        gruposClientes.set(chaveCliente, {
          pessoaId: alteracao.pessoaId,

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

    // ========================================================
    // 3. CRIAR NOTIFICAÇÕES
    // ========================================================

    let notificacoesCriadas = 0;

    let batch = db.batch();
    let operacoesNoBatch = 0;

    const enviarBatch = async () => {
      if (operacoesNoBatch === 0) {
        return;
      }

      await batch.commit();

      console.log(`💾 Batch gravado com ${operacoesNoBatch} operação(ões).`);

      batch = db.batch();
      operacoesNoBatch = 0;
    };

    for (const [pessoaId, grupo] of gruposClientes.entries()) {
      // ======================================================
      // ID ÚNICO DA NOTIFICAÇÃO
      // ======================================================

      const identificadores = grupo.itens
        .map(
          (item) =>
            `${item.empresaId}_${item.opId}_${item.opSeq}_${item.ultimoLancamentoId}_${item.macroStatus}`,
        )
        .sort();

      const notificacaoId = `${pessoaId}_${identificadores.join("__")}`;

      const notificacaoRef = db.collection("notificacoesOP").doc(notificacaoId);

      const notificacaoSnapshot = await notificacaoRef.get();

      if (notificacaoSnapshot.exists) {
        notificacoesExistentes++;

        console.log(`ℹ️ Notificação ${notificacaoId} já existe.`);

        continue;
      }

      // ======================================================
      // CRIAR NOTIFICAÇÃO
      // ======================================================

      batch.set(notificacaoRef, {
        pessoaId,

        clienteNome: grupo.clienteNome,
        clienteRazaoSocial: grupo.clienteRazaoSocial,

        ddd: grupo.ddd,
        telefone: grupo.telefone,
        email: grupo.email,

        quantidadeItens: grupo.itens.length,

        itens: grupo.itens.map((item) => ({
          opDocId: item.opDocId,

          empresaId: item.empresaId,
          opId: item.opId,
          opSeq: item.opSeq,

          pedidoId: item.pedidoId,
          codigoPedido: item.codigoPedido,

          etapaAnterior: item.etapaAnterior,
          etapaAtual: item.etapaAtual,

          dataEtapaAtual: item.dataEtapaAtual,
          ultimoLancamentoId: item.ultimoLancamentoId,

          macroStatus: item.macroStatus,
          textoStatus: item.textoStatus,

          // NOVO
          dataEntrega: item.dataEntrega || null,
        })),

        status: "pendente",

        criadoEm: FieldValue.serverTimestamp(),
        enviadoEm: null,
        atualizadoEm: FieldValue.serverTimestamp(),
      });

      notificacoesCriadas++;
      operacoesNoBatch++;

      // IMPORTANTE:
      // NÃO marcamos mais a fase como notificada aqui.
      //
      // Ela só será marcada depois que o WhatsApp
      // realmente for aceito pela Z-API.
      //
      // Isso evita perder uma fase quando houver erro
      // de envio.

      if (operacoesNoBatch >= 450) {
        await enviarBatch();
      }
    }

    await enviarBatch();

    // ========================================================
    // FINALIZAÇÃO
    // ========================================================

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

        fasesNovas,
        fasesJaNotificadas,

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
