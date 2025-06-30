import conn from "@/service/Conexao/conn";
import { OfertaForm } from "@/types/types";

// Buscar produtos disponíveis para oferta
export async function listarProdutos() {
  const response = await conn.get("/produtos/listrar");
  return response.data;
}

// Cadastrar nova oferta
export async function cadastrarOferta(oferta: OfertaForm) {
  const response = await conn.post("/ofertas/cadastrar", {
    ...oferta,
    data_inicio: oferta.data_inicio || undefined,
    data_fim: oferta.data_fim || undefined,
  });
  return response.data;
}
