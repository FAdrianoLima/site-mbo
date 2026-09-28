const axios = require("axios");
const admin = require("./firebaseAdmin");

const db = admin.firestore();
const { FieldValue } = admin.firestore;

exports.handler = async () => {
  try {
    console.log("🔄 Iniciando sincronização de clientes...");

    const response = await axios.get(process.env.COSMOS_CLIENTES_URL);
    const clientes = response.data;

    if (!Array.isArray(clientes)) {
      throw new Error("O CosmosERP não retornou uma lista de clientes.");
    }

    console.log(`📦 Clientes recebidos: ${clientes.length}`);

    const snapshot = await db.collection("clientes").get();

    const clientesExistentes = new Map();

    snapshot.forEach((doc) => {
      clientesExistentes.set(doc.id, doc.data());
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

    for (const cliente of clientes) {
      if (!cliente.PessoaID) continue;

      const id = String(cliente.PessoaID);
      const existente = clientesExistentes.get(id);

      const dados = {
        cosmosPessoaId: cliente.PessoaID,
        cnpjCpf: cliente.PessoaCnpjCpf || "",
        razaoSocial: cliente.PessoaRazaoSocial || "",
        nomeFantasia: cliente.PessoaFantasia || "",
        ddd: cliente.PessoaDDD || "",
        telefone: cliente.PessoaFone || "",
        email: cliente.PessoaEmail || "",
      };

      // CLIENTE NOVO
      if (!existente) {
        const ref = db.collection("clientes").doc(id);

        batch.set(ref, {
          ...dados,
          criadoEm: FieldValue.serverTimestamp(),
          atualizadoEm: FieldValue.serverTimestamp(),
        });

        novos++;
        operacoesNoBatch++;
      }

      // CLIENTE EXISTENTE
      else {
        const mudou =
          existente.cnpjCpf !== dados.cnpjCpf ||
          existente.razaoSocial !== dados.razaoSocial ||
          existente.nomeFantasia !== dados.nomeFantasia ||
          existente.ddd !== dados.ddd ||
          existente.telefone !== dados.telefone ||
          existente.email !== dados.email;

        if (!mudou) {
          semAlteracao++;
          continue;
        }

        const ref = db.collection("clientes").doc(id);

        batch.update(ref, {
          ...dados,
          atualizadoEm: FieldValue.serverTimestamp(),
        });

        atualizados++;
        operacoesNoBatch++;
      }

      // Limite de segurança do Firestore
      if (operacoesNoBatch >= 450) {
        await enviarBatch();
      }
    }

    await enviarBatch();

    console.log("✅ Sincronização finalizada.");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sucesso: true,
        encontrados: clientes.length,
        novos,
        atualizados,
        semAlteracao,
      }),
    };
  } catch (error) {
    console.error("❌ Erro ao sincronizar clientes:", error);

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
