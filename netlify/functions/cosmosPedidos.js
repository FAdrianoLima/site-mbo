import axios from "axios";

export default async () => {
  try {
    const response = await axios.get(process.env.COSMOS_PEDIDOS_URL);

    return new Response(
      JSON.stringify({
        sucesso: true,
        quantidade: Array.isArray(response.data) ? response.data.length : 0,
        dados: response.data,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Erro CosmosERP:", error);

    return new Response(
      JSON.stringify({
        sucesso: false,
        erro: "Não foi possível consultar os pedidos do CosmosERP.",
        detalhe: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
