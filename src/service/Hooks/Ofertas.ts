import { useState, useEffect } from "react";
import conn from "@/service/Conexao/conn";
import { Oferta } from "@/types/types";

export function useOfertas() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfertas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await conn.get<Oferta[]>("/ofertas/listrar");
        setOfertas(response.data);
      } catch (err: unknown) {
        let mensagem = "Erro ao buscar ofertas.";

        if (typeof err === "object" && err !== null && "response" in err) {
          const e = err as {
            response?: {
              data?: {
                erro?: string;
                message?: string;
              };
            };
            message?: string;
          };

          mensagem =
            e.response?.data?.erro ||
            e.response?.data?.message ||
            e.message ||
            mensagem;
        } else if (err instanceof Error) {
          mensagem = err.message;
        }

        setError(mensagem);
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, []);

  return { ofertas, loading, error };
}
