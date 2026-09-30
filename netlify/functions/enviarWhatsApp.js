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

// Monta telefone do cliente usando DDD + telefone
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

// Normaliza um telefone que já pode estar completo
function normalizarTelefoneCompleto(telefone) {
  let numero = limparTelefone(telefone);

  if (!numero) {
    return null;
  }

  // Já está com código do Brasil
  if (numero.startsWith("55")) {
    if (numero.length !== 12 && numero.length !== 13) {
      return null;
    }

    return numero;
  }

  // Número brasileiro sem 55
  if (numero.length === 10 || numero.length === 11) {
    return `55${numero}`;
  }

  return null;
}

// ============================================================
// MONTAR MENSAGEM DO CLIENTE
// ============================================================

function montarMensagem(notificacao) {
  const nome =
    notificacao.clienteNome || notificacao.clienteRazaoSocial || "cliente";

  const itens = Array.isArray(notificacao.itens) ? notificacao.itens : [];

  // ==========================================================
  // AGRUPAR POR PEDIDO
  // ==========================================================

  const pedidos = new Map();

  for (const item of itens) {
    const codigoPedido = item.codigoPedido || item.pedidoId || "não informado";

    const chave = String(codigoPedido);

    if (!pedidos.has(chave)) {
      pedidos.set(chave, []);
    }

    pedidos.get(chave).push(item);
  }

  // ==========================================================
  // MONTAR MENSAGEM
  // ==========================================================

  let mensagem = `Olá, ${nome}!

Temos uma atualização sobre o seu pedido.

`;

  for (const [codigoPedido] of pedidos.entries()) {
    mensagem += `Pedido: ${codigoPedido}

Seu pedido está em nosso processo de produção.

`;
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

  // A Z-API normalmente retorna um identificador
  // quando a mensagem foi aceita.
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
          `✅ Z-API aceitou mensagem do cliente ${notificacao.codigoCliente}.`,
        );

        console.log(`🆔 Message ID: ${resultado.messageId}`);

        // ====================================================
        // MARCAR COMO ENVIADO
        // ====================================================

        await doc.ref.update({
          status: "enviado",

          enviadoEm: FieldValue.serverTimestamp(),

          telefoneEnviado: telefone,

          quantidadeItens: notificacao.quantidadeItens || 0,

          zapiMessageId: resultado.messageId,

          atualizadoEm: FieldValue.serverTimestamp(),
        });

        console.log(
          `💾 Notificação ${doc.id} marcada como ENVIADO no Firestore.`,
        );

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
          `❌ Erro ao enviar WhatsApp para cliente ${notificacao.codigoCliente}:`,
          erroTexto,
        );

        // ====================================================
        // MARCAR COMO ERRO
        // ====================================================

        await doc.ref.update({
          status: "erro",

          erro: erroTexto,

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
