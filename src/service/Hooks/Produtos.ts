import { useEffect, useState, useCallback } from 'react';
import { Produto, ImagemData } from '@/types/types';
import instance from '@/service/Conexao/conn';

export function useProduto() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [imagens, setImagens] = useState<ImagemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get('/produtos/listrar');
      setProdutos(response.data || []);
      return response.data;
    } catch (err: unknown) {
      handleError(err, 'Erro ao buscar produtos.');
      setProdutos([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  const fetchImagens = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get('/imagens/Listrar');
      setImagens(response.data || []);
      return response.data;
    } catch (err: unknown) {
      handleError(err, 'Erro ao buscar imagens.');
      setImagens([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImagem = async (imagem: ImagemData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await instance.post('/imagens/', imagem);
      setSuccess('Imagem salva com sucesso!');
      return response.data;
    } catch (err: unknown) {
      handleError(err, 'Erro ao salvar imagem.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cadastrarProduto = async (produto: Produto) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await instance.post('/produtos', produto);
      setSuccess('Produto cadastrado com sucesso!');
      return response.data;
    } catch (err: unknown) {
      handleError(err, 'Erro ao cadastrar produto.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: unknown, fallbackMessage: string) => {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || fallbackMessage);
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError(fallbackMessage);
    }
    console.error(err);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    produtos,
    imagens,
    loading,
    error,
    success,
    fetchProdutos,
    fetchImagens,
    uploadImagem,
    cadastrarProduto,
    clearMessages,
  };
}
