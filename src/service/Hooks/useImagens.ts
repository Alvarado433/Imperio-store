import { useState, useEffect } from "react";
import instance from "../Conexao/conn";


export interface Imagem {
  id: number;
  descricao: string | null;
  imagem_base64: string | null;
}

export function useImagens(active: boolean) {
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) {
      setImagens([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    instance
      .get<Imagem[]>("/imagens/Listrar")
      .then((res) => {
        setImagens(res.data);
      })
      .catch(() => {
        setError("Erro ao carregar imagens");
        setImagens([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [active]);

  return { imagens, loading, error };
}
