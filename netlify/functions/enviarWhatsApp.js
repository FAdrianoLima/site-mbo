const axios = require("axios");

const admin = require("./firebaseAdmin");

const db = admin.firestore();

const { FieldValue } = admin.firestore;

// ============================================================
// TELEFONE
// ============================================================

function limparTelefone(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function montarTelefone(ddd, telefone) {
  const dddLimpo = limparTelefone(ddd);
  const telefoneLimpo = limparTelefone(telefone);

  if (!dddLimpo || !telefoneLimpo) {
    return null;
  }

  const numero = `55${dddLimpo}${telefoneLimpo}`;

  if (numero.length < 12 || numero.length > 13) {
    return null;
  }

  return numero;
}

function normalizarTelefoneCompleto(telefone) {
  let numero = limparTelefone(telefone);

  if (!numero) {
    return null;
  }

  if (numero.startsWith("55")) {
    if (numero.length !== 12 && numero.length !== 13) {
      return null;
    }

    return numero;
  }

  if (numero.length === 10 || numero.length === 11) {
    return `55${numero}`;
  }

  return null;
}

// ============================================================
// FORMATAR DATA
// ============================================================

function formatarDataEntrega(data) {
  if (!data) {
    return null;
  }

  const texto = String(data).trim();

  // Exemplo:
  // 2026-03-17T00:00:00
  const match = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  // Caso venha em outro formato
  const dataObj = new Date(texto);

  if (Number.isNaN(dataObj.getTime())) {
    return null;
  }

  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const ano = dataObj.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

// ============================================================
// TEXTO DO STATUS
// ============================================================

function textoStatus(macroStatus) {
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
// MONTAR MENSAGEM DO CLIENTE
// ============================================================

function montarMensagem(notificacao) {
  const nome =
    notificacao.clienteNome || notificacao.clienteRazaoSocial || "cliente";

  const itens = Array.isArray(notificacao.itens) ? notificacao.itens : [];

  let mensagem = `Olá, ${nome}!

Temos uma atualização sobre o seu pedido.

`;

  for (const item of itens) {
    const codigoPedido = item.codigoPedido || item.pedidoId || "não informado";

    mensagem += `Pedido: ${codigoPedido}

${textoStatus(item.macroStatus)}

`;

    const dataEntrega = formatarDataEntrega(item.dataEntrega);

    if (dataEntrega) {
      mensagem += `Previsão de entrega: ${dataEntrega}

`;
    }
  }

  mensagem += `Esta é uma mensagem automática.

Em caso de dúvidas, entre em contato pelo número:
+55 54 9627-0768`;

  return mensagem.trim();
}

// ============================================================
// Z-API
// ============================================================

async function enviarMensagemZApi(phone, message) {
  const instanceId = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;
  const clientToken = process.env.ZAPI_CLIENT_TOKEN;

  if (!instanceId) {
    throw new Error("ZAPI_INSTANCE_ID não configurada.");
  }

  if (!token) {
    throw new Error("ZAPI_TOKEN não configurada.");
  }

  if (!clientToken) {
    throw new Error("ZAPI_CLIENT_TOKEN não configurada.");
  }

  const url =
    `https://api.z-api.io/instances/${instanceId}` +
    `/token/${token}/send-text`;

  console.log(`📱 Z-API → ${phone}`);

  const response = await axios.post(
    url,
    {
      phone,
      message,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Client-Token": clientToken,
      },

      timeout: 15000,
    },
  );

  console.log("📨 Resposta Z-API:", JSON.stringify(response.data));

  const messageId =
    response.data?.messageId ||
    response.data?.id ||
    response.data?.zaapId ||
    null;

  if (!messageId) {
    throw new Error(
      `Z-API não retornou identificador de mensagem. Resposta: ${JSON.stringify(
        response.data,
      )}`,
    );
  }

  return {
    ...response.data,
    messageId,
  };
}

// ============================================================
// MARCAR FASE COMO NOTIFICADA
// ============================================================

async function marcarFasesComoNotificadas(notificacao) {
  const itens = Array.isArray(notificacao.itens) ? notificacao.itens : [];

  const atualizacoes = new Map();

  for (const item of itens) {
    if (!item.opDocId || !item.macroStatus) {
      continue;
    }

    if (!atualizacoes.has(item.opDocId)) {
      atualizacoes.set(item.opDocId, new Set());
    }

    atualizacoes.get(item.opDocId).add(item.macroStatus);
  }

  for (const [opDocId, fases] of atualizacoes.entries()) {
    const opRef = db.collection("opStatus").doc(opDocId);

    const opSnapshot = await opRef.get();

    if (!opSnapshot.exists) {
      console.warn(`⚠️ OP ${opDocId} não encontrada ao marcar fase.`);

      continue;
    }

    const op = opSnapshot.data();

    const fasesNotificadas = {
      ...(op.fasesNotificadas || {}),
    };

    let ultimaFase = null;

    for (const fase of fases) {
      fasesNotificadas[fase] = true;
      ultimaFase = fase;
    }

    await opRef.update({
      fasesNotificadas,

      ultimaFaseNotificada: ultimaFase,

      ultimaNotificacaoEm: FieldValue.serverTimestamp(),

      atualizadoEm: FieldValue.serverTimestamp(),
    });

    console.log(
      `💾 OP ${opDocId}: fases notificadas → ${Array.from(fases).join(", ")}`,
    );
  }
}

// ============================================================
// RELATÓRIO ADMINISTRATIVO
// ============================================================

function montarRelatorioExecucao({
  total,
  enviadas,
  erros,
  semTelefone,
  relatorios,
}) {
  const data = new Date();

  const dataFormatada = data.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  let mensagem = `📊 RELATÓRIO DE ENVIO — MBO

🕐 Execução: ${dataFormatada}

📦 Notificações encontradas: ${total}

✅ Enviadas: ${enviadas}

❌ Erros: ${erros}

⚠️ Sem telefone: ${semTelefone}

`;

  if (relatorios.length === 0) {
    mensagem += `
ℹ️ Nenhuma notificação foi processada nesta execução.`;

    return mensagem;
  }

  mensagem += `
━━━━━━━━━━━━━━━━━━`;

  for (const relatorio of relatorios) {
    mensagem += `

👤 Cliente:
${relatorio.clienteNome || "Não informado"}

🔢 Código:
${relatorio.codigoCliente || "Não informado"}

📱 Telefone:
${relatorio.telefone || "Não informado"}

📌 Status:
${relatorio.status}`;

    if (relatorio.messageId) {
      mensagem += `

🆔 ID Z-API:
${relatorio.messageId}`;
    }

    if (relatorio.mensagem) {
      mensagem += `

📨 Mensagem enviada:
${relatorio.mensagem}`;
    }

    if (relatorio.erro) {
      mensagem += `

❌ Erro:
${relatorio.erro}`;
    }

    mensagem += `

━━━━━━━━━━━━━━━━━━`;
  }

  return mensagem.trim();
}

// ============================================================
// HANDLER
// ============================================================

exports.handler = async () => {
  try {
    console.log("📱 Iniciando envio de WhatsApp...");

    const snapshot = await db
      .collection("notificacoesOP")
      .where("status", "==", "pendente")
      .get();

    console.log(`📦 Notificações pendentes: ${snapshot.size}`);

    let enviadas = 0;
    let erros = 0;
    let semTelefone = 0;

    const relatorios = [];

    // ========================================================
    // PROCESSAR NOTIFICAÇÕES
    // ========================================================

    for (const doc of snapshot.docs) {
      const notificacao = doc.data();

      const telefone = montarTelefone(notificacao.ddd, notificacao.telefone);

      // ======================================================
      // SEM TELEFONE
      // ======================================================

      if (!telefone) {
        console.log(`⚠️ Cliente ${notificacao.pessoaId} sem telefone válido.`);

        const erro = "Cliente não possui telefone válido.";

        await doc.ref.update({
          status: "erro",
          erro,
          atualizadoEm: FieldValue.serverTimestamp(),
        });

        semTelefone++;

        relatorios.push({
          clienteNome:
            notificacao.clienteNome ||
            notificacao.clienteRazaoSocial ||
            "Não informado",

          codigoCliente: notificacao.pessoaId || "Não informado",

          telefone: notificacao.telefone || "Não informado",

          status: "❌ ERRO",

          erro,
        });

        continue;
      }

      // ======================================================
      // MONTAR MENSAGEM
      // ======================================================

      const mensagem = montarMensagem(notificacao);

      console.log(
        `📤 Enviando WhatsApp para cliente ${notificacao.pessoaId}...`,
      );

      console.log(`📱 Número: ${telefone}`);

      console.log(
        `📦 Quantidade de itens: ${notificacao.quantidadeItens || 0}`,
      );

      try {
        // ====================================================
        // ENVIAR PARA CLIENTE
        // ====================================================

        const resultado = await enviarMensagemZApi(telefone, mensagem);

        console.log(
          `✅ Z-API aceitou mensagem do cliente ${notificacao.pessoaId}.`,
        );

        console.log(`🆔 Message ID: ${resultado.messageId}`);

        // ====================================================
        // MARCAR NOTIFICAÇÃO COMO ENVIADA
        // ====================================================

        await doc.ref.update({
          status: "enviado",

          enviadoEm: FieldValue.serverTimestamp(),

          telefoneEnviado: telefone,

          quantidadeItens: notificacao.quantidadeItens || 0,

          zapiMessageId: resultado.messageId,

          atualizadoEm: FieldValue.serverTimestamp(),
        });

        // ====================================================
        // AGORA SIM MARCAR FASES
        // ====================================================

        await marcarFasesComoNotificadas(notificacao);

        console.log(
          `💾 Fases da notificação ${doc.id} marcadas como enviadas.`,
        );

        enviadas++;

        // ====================================================
        // RELATÓRIO
        // ====================================================

        relatorios.push({
          clienteNome:
            notificacao.clienteNome ||
            notificacao.clienteRazaoSocial ||
            "Não informado",

          codigoCliente: notificacao.pessoaId || "Não informado",

          telefone,

          status: "✅ ENVIADO",

          messageId: resultado.messageId,

          mensagem,
        });
      } catch (error) {
        const erro =
          error.response?.data ||
          error.message ||
          "Erro desconhecido ao enviar WhatsApp.";

        const erroTexto =
          typeof erro === "string" ? erro : JSON.stringify(erro);

        console.error(
          `❌ Erro ao enviar WhatsApp para cliente ${notificacao.pessoaId}:`,
          erroTexto,
        );

        await doc.ref.update({
          status: "erro",

          erro: erroTexto,

          atualizadoEm: FieldValue.serverTimestamp(),
        });

        erros++;

        relatorios.push({
          clienteNome:
            notificacao.clienteNome ||
            notificacao.clienteRazaoSocial ||
            "Não informado",

          codigoCliente: notificacao.pessoaId || "Não informado",

          telefone,

          status: "❌ ERRO",

          mensagem,

          erro: erroTexto,
        });
      }
    }

    // ========================================================
    // RELATÓRIO ADMINISTRATIVO
    // ========================================================

    const telefoneAdmin = normalizarTelefoneCompleto(
      process.env.ZAPI_ADMIN_PHONE,
    );

    let relatorioEnviado = false;

    if (!telefoneAdmin) {
      console.warn("⚠️ ZAPI_ADMIN_PHONE não configurada ou inválida.");
    } else {
      try {
        const relatorio = montarRelatorioExecucao({
          total: snapshot.size,
          enviadas,
          erros,
          semTelefone,
          relatorios,
        });

        console.log("📊 Enviando relatório administrativo...");

        console.log(`📱 Número administrativo: ${telefoneAdmin}`);

        const resultadoAdmin = await enviarMensagemZApi(
          telefoneAdmin,
          relatorio,
        );

        console.log("✅ Relatório administrativo enviado.");

        console.log(`🆔 ID relatório Z-API: ${resultadoAdmin.messageId}`);

        relatorioEnviado = true;
      } catch (error) {
        console.error(
          "❌ Erro ao enviar relatório administrativo:",
          error.response?.data || error.message,
        );
      }
    }

    // ========================================================
    // FINALIZAÇÃO
    // ========================================================

    console.log("✅ Processamento de WhatsApp finalizado.");

    console.log(
      `📊 Resultado: ${enviadas} enviadas | ${erros} erros | ${semTelefone} sem telefone`,
    );

    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sucesso: true,

        pendentes: snapshot.size,

        enviadas,
        erros,
        semTelefone,

        relatorioEnviado,
      }),
    };
  } catch (error) {
    console.error("❌ Erro no processamento de WhatsApp:", error);

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
