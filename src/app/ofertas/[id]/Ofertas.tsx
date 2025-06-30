'use client';

import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Breadcrumb } from 'react-bootstrap';
import { ShoppingCart, Truck, Percent, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco?: number;
  imagem_url?: string;
  desconto?: number;
  frete_gratis?: boolean;
}

interface Props {
  ofertaId: string;
}

export default function ProdutosOfertas({ ofertaId }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ofertaId) return;

    const fetchProdutos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/ofertas/${ofertaId}/produtos`);
        if (!res.ok) throw new Error(`Erro ao carregar produtos: ${res.statusText}`);
        const data = await res.json();

        setProdutos(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erro desconhecido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [ofertaId]);

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p className="text-danger">Erro: {error}</p>;

  return (
    <div className="page-wrapper px-3 py-4">
      <Breadcrumb className="breadcrumb-custom mb-4">
        <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
        <Breadcrumb.Item active>Produtos da Oferta #{ofertaId}</Breadcrumb.Item>
      </Breadcrumb>

      <Row xs={1} sm={2} md={3} className="g-4">
        {produtos.length === 0 && <p>Nenhum produto encontrado para esta oferta.</p>}

        {produtos.map(produto => {
          const precoDesconto = produto.desconto
            ? produto.preco! * (1 - produto.desconto / 100)
            : produto.preco;

          return (
            <Col key={produto.id}>
              <div className="card-produto h-100 d-flex flex-column shadow-sm rounded-3">
                <div className="img-wrapper text-center position-relative">
                  {produto.imagem_url ? (
                    <Image
                      src={produto.imagem_url}
                      alt={produto.nome}
                      width={300}
                      height={300}
                      className="img-fluid rounded-top"
                      priority={false}
                      style={{ objectFit: 'contain', borderRadius: '0.5rem' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 300,
                        height: 300,
                        backgroundColor: '#f8f8f8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.5rem',
                        color: '#ccc',
                      }}
                    >
                      Sem imagem
                    </div>
                  )}
                  {produto.desconto && (
                    <span className="desconto-badge d-flex align-items-center">
                      <Percent size={14} className="me-1" />
                      {produto.desconto}% OFF
                    </span>
                  )}
                </div>
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <h6 className="fw-bold text-rosa text-truncate" title={produto.nome}>
                    {produto.nome}
                  </h6>
                  <p className="text-muted small flex-grow-1" title={produto.descricao ?? undefined}>
                    {produto.descricao && produto.descricao.length > 80
                      ? produto.descricao.slice(0, 80) + '...'
                      : produto.descricao}
                  </p>
                  <div className="fw-bold fs-5 text-danger mb-1">
                    R$ {precoDesconto?.toFixed(2)}
                  </div>
                  <div className="text-muted small mb-2">em até 10x sem juros</div>
                  {produto.frete_gratis && (
                    <div className="text-success d-flex align-items-center mb-3">
                      <Truck size={16} className="me-1" /> Frete grátis
                    </div>
                  )}
                  <div className="d-flex gap-2 mt-auto">
                    <Button
                      variant="danger"
                      className="flex-grow-1 d-flex align-items-center justify-content-center"
                    >
                      <ShoppingCart size={18} className="me-2" /> Comprar
                    </Button>
                    <Link href={`/produto/${produto.id}`} passHref legacyBehavior>
                      <Button
                        as="a"
                        variant="outline-secondary"
                        className="d-flex align-items-center justify-content-center"
                      >
                        <Eye size={18} /> Ver mais
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
