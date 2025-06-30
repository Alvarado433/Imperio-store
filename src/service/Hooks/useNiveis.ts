import { useState, useEffect } from "react";
import conn from "../Conexao/conn";

export interface Nivel {
  id: number;
  nome: string;
  descricao?: string;
}

export function useNiveis() {
  const [niveis, setNiveis] = useState<Nivel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    conn
      .get("/nivel/listar")
      .then((res) => {
        setNiveis(res.data);
      })
      .catch(() => {
        setError("Erro ao carregar níveis");
      })
      .finally(() => setLoading(false));
  }, []);

  return { niveis, loading, error };
}
