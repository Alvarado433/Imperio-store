'use client';

import { useEffect, useState } from "react";
import instance from "@/service/Conexao/conn";

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

export function useCategorias(fetch: boolean = true) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await instance.get("/categorias/listrar");
      setCategorias(res.data);
    } catch {
      setError("Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetch) {
      fetchCategorias();
    }
  }, [fetch]);

  return { categorias, loading, error, refetch: fetchCategorias };
}
