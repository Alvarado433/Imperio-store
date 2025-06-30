'use client';

import React, { useEffect, useState } from 'react';
import ImperioStore from "@/components/Imperio/Inicio/Navbar";
import ProdutoCard from "@/components/Produtos/ProdutoCard";
import api from '@/service/Conexao/conn';
import Footer from '@/components/Imperio/Footer/Rodape';

interface Produto {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  categoria?: string;
}

interface Params {
  id: string;
}

interface Imagem {
  imagem_base64?: string;
  url?: string;
}

interface ApiProduto {
  id: number;
  nome?: string;
  name?: string;
  preco?: number;
  price?: number;
  descricao?: string;
  description?: string;
  imagens?: Imagem[];
  categoria?: {
    nome: string;
  };
}

export default function ProdutoPage({ params }: { params: Promise<Params> }) {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolved) => {
      setId(resolved.id);
    });
  }, [params]);

  useEffect(() => {
    if (!id) return;

    api.get<ApiProduto>(`/produtos/${id}`)
      .then((response) => {
        const data = response.data;
        setProduto({
          id: data.id,
          name: data.nome || data.name || '',
          price: data.preco || data.price || 0,
          description: data.descricao || data.description || '',
          images: data.imagens?.map((img: Imagem) =>
            img.imagem_base64 ? `data:image/png;base64,${img.imagem_base64}` : img.url || ''
          ) || [],
          categoria: data.categoria?.nome || undefined,
        });
      })
      .catch((err) => {
        console.error('Erro ao buscar produto:', err);
      });
  }, [id]);

  const handleAddToCart = async (produtoId: number) => {
    try {
      await api.post('/carrinho/adicionar', {
        produto_id: produtoId,
        quantidade: 1,
      });
      alert('Produto adicionado ao carrinho com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      alert('Falha ao adicionar produto ao carrinho.');
    }
  };

  return (
    <>
      <ImperioStore />
      <div className="container mt-5">
        {produto ? (
          <ProdutoCard produto={produto} onAddToCart={handleAddToCart} />
        ) : (
          <p>Carregando produto...</p>
        )}
      </div>
      <Footer />
    </>
  );
}
