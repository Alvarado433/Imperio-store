import { useState, useCallback } from "react";
import conn from "@/service/Conexao/conn";
import { ProdutoCreate } from "@/types/types";

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Tipo guard para checar se o erro tem essa estrutura
function isAxiosErrorResponse(error: unknown): error is AxiosErrorResponse {
  if (typeof error !== "object" || error === null) return false;
  if (!("response" in error)) return false;
  const err = error as Record<string, unknown>;
  if (typeof err.response !== "object" || err.response === null) return false;
  if (!("data" in err.response)) return false;
  if (typeof (err.response as Record<string, unknown>).data !== "object") return false;
  return true;
}

export function useProdutos() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const resetMensagens = useCallback(() => {
    setSuccessMsg("");
    setErrorMsg("");
  }, []);

  const cadastrarProduto = useCallback(
    async (produto: ProdutoCreate): Promise<boolean> => {
      try {
        setLoading(true);
        resetMensagens();

        const response = await conn.post("/produtos/cadastrar", produto);

        if (response.status === 201 || response.data.success) {
          setSuccessMsg("Produto cadastrado com sucesso!");
          return true;
        } else {
          setErrorMsg("Erro ao cadastrar o produto.");
          return false;
        }
      } catch (error: unknown) {
        if (isAxiosErrorResponse(error) && error.response?.data?.message) {
          setErrorMsg(error.response.data.message);
        } else {
          setErrorMsg("Erro inesperado ao cadastrar o produto.");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [resetMensagens]
  );

  return {
    loading,
    successMsg,
    errorMsg,
    cadastrarProduto,
    resetMensagens,
  };
}
