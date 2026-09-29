const axios = require("axios");

const admin = require("./firebaseAdmin");

const db = admin.firestore();

const { FieldValue } = admin.firestore;

// ============================================================
// TELEFONE
// ============================================================

function montarTelefone(ddd, telefone) {
  const dddLimpo = String(ddd || "").replace(/\D/g, "");
  const telefoneLimpo = String(telefone || "").replace(/\D/g, "");

  if (!dddLimpo || !telefoneLimpo) {
    return null;
  }

  const numero = `55${dddLimpo}${telefoneLimpo}`;

  if (numero.length < 12 || numero.length > 13) {
    return null;
  }

  return numero;
}

// ============================================================
// MONTAR MENSAGEM DO CLIENTE
// ============================================================

function montarMensagem(notificacao) {
  const nome =
    notificacao.clienteNome || notificacao.clienteRazaoSocial || "cliente";

  const codigoCliente =
    notificacao.codigoCliente || notificacao.pessoaId || "não informado";

  const itens = Array.isArray(notificacao.itens) ? notificacao.itens : [];

  let mensagem = `Olá, ${nome}!

Temos atualizações nas suas ordens de produção.

Cliente: ${codigoCliente}

`;

  // ==========================================================
  // AGRUPAR POR PEDIDO
  // ==========================================================

  const pedidos = new Map();

  for (const item of itens) {
    const codigoPedido = item.codigoPedido || item.pedidoId || "não informado";

    if (!pedidos.has(String(codigoPedido))) {
      pedidos.set(String(codigoPedido), []);
    }

    pedidos.get(String(codigoPedido)).push(item);
  }

  // ==========================================================
  // MONTAR PEDIDOS E OPs
  // ==========================================================

  for (const [codigoPedido, ops] of pedidos.entries()) {
    mensagem += `Pedido: ${codigoPedido}\n`;

    for (const op of ops) {
      mensagem += `OP: ${op.opId}`;

      if (op.opSeq != null) {
        mensagem += `-${op.opSeq}`;
      }

      mensagem += `\n`;

      mensagem += `Etapa: ${op.etapaAtual || "não informada"}\n`;

      mensagem += `\n`;
    }
  }

  mensagem += "Se precisar de mais informações, estamos à disposição.";

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
    },
  );

  return response.data;
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

👤 Cliente: ${relatorio.clienteNome || "Não informado"}

🔢 Código do cliente: ${relatorio.codigoCliente || "Não informado"}

📱 Telefone: ${relatorio.telefone || "Não informado"}

📌 Status: ${relatorio.status}`;

    if (relatorio.mensagem) {
      mensagem += `

📨 MENSAGEM ENVIADA:

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

    // ========================================================
    // BUSCAR NOTIFICAÇÕES PENDENTES
    // ========================================================

    const snapshot = await db
      .collection("notificacoesOP")
      .where("status", "==", "pendente")
      .get();

    console.log(`📦 Notificações pendentes: ${snapshot.size}`);

    let enviadas = 0;
    let erros = 0;
    let semTelefone = 0;

    // Relatórios que serão enviados para o administrador
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
        console.log(
          `⚠️ Cliente ${notificacao.codigoCliente} sem telefone válido.`,
        );

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

          codigoCliente:
            notificacao.codigoCliente ||
            notificacao.pessoaId ||
            "Não informado",

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
        `📤 Enviando WhatsApp para cliente ${notificacao.codigoCliente}...`,
      );

      console.log(`📦 Quantidade de itens: ${notificacao.quantidadeItens}`);

      try {
        // ====================================================
        // ENVIAR PARA CLIENTE
        // ====================================================

        const resultado = await enviarMensagemZApi(telefone, mensagem);

        console.log(
          `✅ WhatsApp enviado para cliente ${notificacao.codigoCliente}.`,
        );

        // ====================================================
        // MARCAR COMO ENVIADO
        // ====================================================

        await doc.ref.update({
          status: "enviado",

          enviadoEm: FieldValue.serverTimestamp(),

          telefoneEnviado: telefone,

          quantidadeItens: notificacao.quantidadeItens || 0,

          zapiMessageId: resultado?.messageId || resultado?.id || null,

          atualizadoEm: FieldValue.serverTimestamp(),
        });

        enviadas++;

        // ====================================================
        // ADICIONAR AO RELATÓRIO
        // ====================================================

        relatorios.push({
          clienteNome:
            notificacao.clienteNome ||
            notificacao.clienteRazaoSocial ||
            "Não informado",

          codigoCliente:
            notificacao.codigoCliente ||
            notificacao.pessoaId ||
            "Não informado",

          telefone,

          status: "✅ ENVIADO",

          mensagem,
        });
      } catch (error) {
        const erro =
          error.response?.data ||
          error.message ||
          "Erro desconhecido ao enviar WhatsApp.";

        console.error(
          `❌ Erro ao enviar WhatsApp para cliente ${notificacao.codigoCliente}:`,
          erro,
        );

        // ====================================================
        // MARCAR COMO ERRO
        // ====================================================

        await doc.ref.update({
          status: "erro",

          erro,

          atualizadoEm: FieldValue.serverTimestamp(),
        });

        erros++;

        // ====================================================
        // ADICIONAR AO RELATÓRIO
        // ====================================================

        relatorios.push({
          clienteNome:
            notificacao.clienteNome ||
            notificacao.clienteRazaoSocial ||
            "Não informado",

          codigoCliente:
            notificacao.codigoCliente ||
            notificacao.pessoaId ||
            "Não informado",

          telefone,

          status: "❌ ERRO",

          mensagem,

          erro: typeof erro === "string" ? erro : JSON.stringify(erro),
        });
      }
    }

    // ========================================================
    // RELATÓRIO ADMINISTRATIVO
    // ========================================================

    const telefoneAdmin = process.env.ZAPI_ADMIN_PHONE;

    if (!telefoneAdmin) {
      console.warn(
        "⚠️ ZAPI_ADMIN_PHONE não configurada. Relatório não será enviado.",
      );
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

        await enviarMensagemZApi(telefoneAdmin, relatorio);

        console.log("✅ Relatório administrativo enviado.");
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

        relatorioEnviado: Boolean(telefoneAdmin),
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
