import { useState, useEffect } from "react";
import axiosBase from "axios"; // Axios original para tratamento de erros
import conn from "@/service/Conexao/conn";

interface ContagemResponse {
  total_produtos?: number;
  total_categorias?: number;
}

export default function useCards() {
  const [totalProdutos, setTotalProdutos] = useState<number | null>(null);
  const [totalCategorias, setTotalCategorias] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [resProdutos, resCategorias] = await Promise.all([
          conn.get<ContagemResponse>("/produtos/contar"),
          conn.get<ContagemResponse>("/categorias/contar"),
        ]);

        setTotalProdutos(resProdutos.data.total_produtos ?? null);
        setTotalCategorias(resCategorias.data.total_categorias ?? null);
      } catch (err: unknown) {
        if (axiosBase.isAxiosError(err)) {
          setError(
            err.response?.data?.erro ||
            err.message ||
            "Erro desconhecido na requisição"
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro inesperado");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { totalProdutos, totalCategorias, loading, error };
}
