const axios = require("axios");

exports.handler = async () => {
  try {
    console.log("📱 Iniciando teste de envio...");

    const instanceId = process.env.ZAPI_INSTANCE_ID;
    const token = process.env.ZAPI_TOKEN;
    const clientToken = process.env.ZAPI_CLIENT_TOKEN;

    const url =
      `https://api.z-api.io/instances/${instanceId}` +
      `/token/${token}/send-text`;

    console.log("1️⃣ Variáveis:", {
      instanceId: instanceId ? "OK" : "AUSENTE",
      token: token ? "OK" : "AUSENTE",
      clientToken: clientToken ? "OK" : "AUSENTE",
    });

    console.log("2️⃣ Endpoint de envio montado.");
    console.log("3️⃣ Enviando mensagem...");

    const response = await axios({
      method: "POST",
      url,
      timeout: 15000,

      headers: {
        "Content-Type": "application/json",
        "Client-Token": clientToken,
      },

      data: {
        phone: "54981168850",
        message:
          "Olá, Adriano! 👋\n\nEsta é uma mensagem de teste da integração entre o sistema da MBO e o WhatsApp.",
      },
    });

    console.log("4️⃣ Z-API respondeu:");
    console.log(response.status);
    console.log(response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        sucesso: true,
        status: response.status,
        resposta: response.data,
      }),
    };
  } catch (error) {
    console.error("❌ ERRO NO ENVIO");

    console.error("Código:", error.code);
    console.error("Mensagem:", error.message);

    if (error.response) {
      console.error("Status HTTP:", error.response.status);
      console.error("Resposta Z-API:", error.response.data);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        sucesso: false,
        erro: error.response?.data || error.message,
        status: error.response?.status || null,
        codigo: error.code || null,
      }),
    };
  }
};
