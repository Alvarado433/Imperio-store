// src/hooks/useCategorias.ts
import { useState } from 'react';
import axios from '@/service/Conexao/conn';

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

export default function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/categorias/listrar');
      setCategorias(response.data);
    } catch (err) {
      setError('Erro ao carregar categorias.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { categorias, loading, error, fetchCategorias };
}
