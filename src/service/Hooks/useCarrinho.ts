'use client';

import { useState, useEffect } from 'react';
import api from '@/service/Conexao/conn';

export interface CarrinhoItem {
  id: number;
  quantidade: number;
  usuario_id: number;
  produto: {
    id: number;
    nome: string;
    preco: number;
    imagens: { url: string }[];
  };
}

export default function useCarrinho() {
  const [itens, setItens] = useState<CarrinhoItem[]>([]);
  const [carregando, setCarregando] = useState(false);

  const listarCarrinho = async () => {
    setCarregando(true);
    try {
      const response = await api.get('/carrinho/L');
      setItens(response.data);
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err) {
        const axiosError = err as { response: { status: number } };
        if (axiosError.response.status === 401) {
          console.log('Usuário não autenticado. Carrinho vazio.');
          setItens([]);
        }
      } else {
        console.error('Erro ao listar carrinho', err);
      }
    } finally {
      setCarregando(false);
    }
  };

  const adicionarItem = async (produto_id: number, quantidade = 1) => {
    try {
      const response = await api.post('/carrinho/adicionar', { produto_id, quantidade });
      await listarCarrinho();
      return response.data;
    } catch (err: unknown) {
      console.error('Erro ao adicionar item', err);
    }
  };

  const atualizarItem = async (item_id: number, quantidade: number) => {
    try {
      await api.put(`/carrinho/atualizar/${item_id}`, { quantidade });
      await listarCarrinho();
    } catch (err: unknown) {
      console.error('Erro ao atualizar item', err);
    }
  };

  const removerItem = async (item_id: number) => {
    try {
      await api.delete(`/carrinho/remover/${item_id}`);
      await listarCarrinho();
    } catch (err: unknown) {
      console.error('Erro ao remover item', err);
    }
  };

  const limparCarrinho = async () => {
    try {
      await api.delete('/carrinho/limpar');
      await listarCarrinho();
    } catch (err: unknown) {
      console.error('Erro ao limpar carrinho', err);
    }
  };

  useEffect(() => {
    listarCarrinho();
  }, []);

  return {
    itens,
    carregando,
    listarCarrinho,
    adicionarItem,
    atualizarItem,
    removerItem,
    limparCarrinho,
  };
}
