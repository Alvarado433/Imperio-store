import conn from "@/service/Conexao/conn";
import axios from "axios";

export interface ResultadoExclusao {
  sucesso: boolean;
  mensagem: string;
}

export const excluirProduto = async (id: number): Promise<ResultadoExclusao> => {
  try {
    const response = await conn.delete<ResultadoExclusao>(`/excluir/${id}`);
    return response.data;
  } catch (err: unknown) {
    let mensagem = "Erro ao excluir o produto.";
    if (axios.isAxiosError(err)) {
      mensagem = err.response?.data?.erro || err.message || mensagem;
    } else if (err instanceof Error) {
      mensagem = err.message;
    }
    // Retornamos o erro sem lançar exceção para evitar crash no deploy
    return { sucesso: false, mensagem };
  }
};
