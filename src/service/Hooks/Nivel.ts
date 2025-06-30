import { useState, useEffect } from "react";
import { Nivel } from "@/types/types";
import instance from "../Conexao/conn";

export default function useNivel() {
  const [niveis, setNiveis] = useState<Nivel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNiveis() {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.get<Nivel[]>("/nivel/");
        setNiveis(response.data);
      } catch (err: unknown) {
        let mensagem = "Erro desconhecido ao carregar níveis";

        if (typeof err === "object" && err !== null && "response" in err) {
          const e = err as {
            response?: {
              data?: {
                detail?: string;
                erro?: string;
              };
            };
            message?: string;
          };

          mensagem =
            e.response?.data?.detail ||
            e.response?.data?.erro ||
            e.message ||
            mensagem;
        } else if (err instanceof Error) {
          mensagem = err.message;
        }

        setError(mensagem);
      } finally {
        setLoading(false);
      }
    }

    fetchNiveis();
  }, []);

  return { niveis, loading, error };
}
