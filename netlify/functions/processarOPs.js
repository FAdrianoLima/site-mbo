const admin = require("./firebaseAdmin");

const db = admin.firestore();

// ============================================================
// IDENTIFICAR MACROSTATUS
// ============================================================

function identificarMacroStatus(etapa) {
  const texto = String(etapa || "")
    .trim()
    .toUpperCase();

  if (!texto) {
    return null;
  }

  // ----------------------------------------------------------
  // PRODUÇÃO
  // ----------------------------------------------------------
  //
  // Tudo que não for uma etapa de expedição,
  // entrega ou logística será considerado PRODUÇÃO.
  //
  // Exemplos:
  // TORNO
  // FRESA
  // SOLDA
  // MATERIAL RECEBIDO/SEPARADO
  // ACABAMENTO
  // etc.
  //
  // ----------------------------------------------------------

  const etapasForaDaProducao = [
    "EXPEDIÇÃO",
    "EXPEDICAO",

    "DISPONÍVEL P/ENTREGA",
    "DISPONIVEL P/ENTREGA",

    "LOGÍSTICA",
    "LOGISTICA",

    "ENTREGUE",
  ];

  if (!etapasForaDaProducao.includes(texto)) {
    return "producao";
  }

  // ----------------------------------------------------------
  // EXPEDIÇÃO
  // ----------------------------------------------------------

  if (texto === "EXPEDIÇÃO" || texto === "EXPEDICAO") {
    return "expedicao";
  }

  // ----------------------------------------------------------
  // DISPONÍVEL PARA ENTREGA
  // ----------------------------------------------------------

  if (texto === "DISPONÍVEL P/ENTREGA" || texto === "DISPONIVEL P/ENTREGA") {
    return "disponivel_entrega";
  }

  // ----------------------------------------------------------
  // LOGÍSTICA
  // ----------------------------------------------------------

  if (texto === "LOGÍSTICA" || texto === "LOGISTICA") {
    return "logistica";
  }

  // ----------------------------------------------------------
  // ENTREGUE
  // ----------------------------------------------------------

  if (texto === "ENTREGUE") {
    return "entregue";
  }

  return null;
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

    let ignoradasProducao = 0;
    let fasesNovas = 0;
    let fasesJaNotificadas = 0;

    let semPedido = 0;
    let semCliente = 0;

    const alteracoes = [];

    // ========================================================
    // 1. ENCONTRAR OPs COM MUDANÇA
    // ========================================================

    for (const doc of snapshot.docs) {
      verificadas++;

      const op = doc.data();

      // ------------------------------------------------------
      // Primeira sincronização da OP
      // ------------------------------------------------------

      if (!op.etapaAnterior) {
        continue;
      }

      // ------------------------------------------------------
      // Não houve mudança
      // ------------------------------------------------------

      if (op.etapaAnterior === op.etapaAtual) {
        continue;
      }

      comMudanca++;

      console.log(`🔄 OP ${op.opId}: ${op.etapaAnterior} → ${op.etapaAtual}`);

      // ======================================================
      // IDENTIFICAR FASE ATUAL
      // ======================================================

      const macroStatus = identificarMacroStatus(op.etapaAtual);

      if (!macroStatus) {
        console.log(
          `ℹ️ OP ${op.opId}: etapa "${op.etapaAtual}" não gera notificação.`,
        );

        ignoradasProducao++;

        continue;
      }

      console.log(`📌 OP ${op.opId}: macrostatus = ${macroStatus}`);

      // ======================================================
      // VERIFICAR SE ESSA FASE JÁ FOI NOTIFICADA
      // ======================================================

      const fasesNotificadas = op.fasesNotificadas || {};

      if (fasesNotificadas[macroStatus]) {
        console.log(
          `ℹ️ OP ${op.opId}: fase "${macroStatus}" já foi notificada.`,
        );

        fasesJaNotificadas++;

        continue;
      }

      fasesNovas++;

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
      // CÓDIGO DO CLIENTE
      // ======================================================

      const codigoCliente = cliente.cosmosPessoaId || pedido.pessoaId;

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

        macroStatus,

        textoStatus: textoMacroStatus(macroStatus),
      });
    }

    console.log(`📋 Alterações que gerarão notificações: ${alteracoes.length}`);

    console.log(`🏭 Novas fases de produção/status: ${fasesNovas}`);

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

    // ========================================================
    // 3. CRIAR NOTIFICAÇÕES
    // ========================================================

    let notificacoesCriadas = 0;
    let notificacoesExistentes = 0;

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
      // ID DA NOTIFICAÇÃO
      // ======================================================

      const identificadores = grupo.itens
        .map(
          (item) =>
            `${item.empresaId}_${item.opId}_${item.opSeq}_${item.ultimoLancamentoId}_${item.macroStatus}`,
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

      // ======================================================
      // CRIAR NOTIFICAÇÃO
      // ======================================================

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

          macroStatus: item.macroStatus,

          textoStatus: item.textoStatus,
        })),

        status: "pendente",

        criadoEm: admin.firestore.FieldValue.serverTimestamp(),

        enviadoEm: null,

        atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
      });

      notificacoesCriadas++;
      operacoesNoBatch++;

      // ======================================================
      // ATUALIZAR FASE COMO NOTIFICADA
      // ======================================================

      for (const item of grupo.itens) {
        const opRef = db.collection("opStatus").doc(item.opDocId);

        const fasesNotificadas =
          snapshot.docs.find((d) => d.id === item.opDocId)?.data()
            ?.fasesNotificadas || {};

        fasesNotificadas[item.macroStatus] = true;

        batch.update(opRef, {
          fasesNotificadas,

          ultimaFaseNotificada: item.macroStatus,

          ultimaNotificacaoEm: admin.firestore.FieldValue.serverTimestamp(),

          atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
        });

        operacoesNoBatch++;
      }

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

        ignoradasProducao,

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
