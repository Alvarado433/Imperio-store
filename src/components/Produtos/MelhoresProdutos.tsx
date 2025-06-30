'use client';

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { SiPix } from 'react-icons/si';
import api from '@/service/Conexao/conn'; // import da instância axios configurada

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  pix_valor?: number;
  imagens: {
    imagem_base64?: string;
  }[];
  categoria?: {
    nome: string;
  };
  parcelamento?: string;
  formas_pagamento?: string[];
  estoque?: string;
}

export default function ProdutosEmDestaque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Produto[]>('/produtos/listrar')  // sem URL completa
      .then((res) => {
        setProdutos(res.data);
        setLoading(false);
      })
      .catch(() => {
        setErro('Erro ao carregar produtos.');
        setLoading(false);
      });
  }, []);

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const slidesToShow = produtos.length >= 3 ? 3 : produtos.length;

  const settings = {
    dots: true,
    infinite: produtos.length > slidesToShow,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: produtos.length >= 2 ? 2 : produtos.length,
        },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const visualizarProduto = (produto: Produto) => {
    window.location.href = `/produto/${produto.id}`;
  };

  const verMaisProdutos = () => {
    window.location.href = '/produtos';
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );

  if (erro)
    return (
      <Alert variant="danger" className="my-5 text-center">
        {erro}
      </Alert>
    );

  if (produtos.length === 0)
    return (
      <Alert variant="info" className="my-5 text-center">
        Nenhum produto disponível no momento.
      </Alert>
    );

  return (
    <section className="prod-section">
      <div className="container">
        <h2 className="prod-title">✨ Produtos em Destaque</h2>

        <Slider {...settings}>
          {produtos.map((produto) => (
            <div key={produto.id} className="prod-slider-item">
              <Card
                className="prod-card"
                onClick={() => visualizarProduto(produto)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    visualizarProduto(produto);
                  }
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(-10px)';
                  card.style.boxShadow = '0 12px 40px rgba(166, 95, 109, 0.35)';
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(0)';
                  card.style.boxShadow = '0 8px 20px rgba(166, 95, 109, 0.15)';
                }}
              >
                <div
                  className="prod-fav-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorito(produto.id);
                  }}
                  role="button"
                  aria-label={
                    favoritos.includes(produto.id)
                      ? 'Remover dos favoritos'
                      : 'Adicionar aos favoritos'
                  }
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      toggleFavorito(produto.id);
                    }
                  }}
                >
                  {favoritos.includes(produto.id) ? (
                    <BsHeartFill size={26} />
                  ) : (
                    <BsHeart size={26} />
                  )}
                </div>

                <Card.Img
                  variant="top"
                  src={
                    produto.imagens &&
                    produto.imagens.length > 0 &&
                    produto.imagens[0].imagem_base64
                      ? `data:image/jpeg;base64,${produto.imagens[0].imagem_base64}`
                      : 'https://via.placeholder.com/400x300?text=Sem+Imagem'
                  }
                  alt={produto.nome}
                  className="prod-card-image"
                />

                <Card.Body className="prod-card-body">
                  <p>
                    <strong>Nome:</strong> {produto.nome}
                  </p>
                  <p>
                    <strong>Categoria:</strong>{' '}
                    {produto.categoria?.nome || 'Sem categoria'}
                  </p>
                  <div className="prod-pix-container">
                    <SiPix size={22} color="#238636" />
                    <p className="prod-pix-valor">
                      Valor no PIX: R${' '}
                      {produto.pix_valor
                        ? produto.pix_valor.toFixed(2)
                        : produto.preco.toFixed(2)}
                    </p>
                  </div>

                  <p>
                    <strong>Preço:</strong> R${' '}
                    {produto.preco.toFixed(2)}
                  </p>

                  <p className="prod-parcelamento">
                    <strong>Parcelamento:</strong>{' '}
                    {produto.parcelamento &&
                    /^\d+$/.test(produto.parcelamento.trim())
                      ? `Até ${produto.parcelamento.trim()}x sem juros`
                      : produto.parcelamento
                      ? produto.parcelamento
                      : 'Sem parcelamento'}
                  </p>

                  <p>
                    <strong>Formas de pagamento:</strong>{' '}
                    {(produto.formas_pagamento || []).length > 0 ? (
                      (produto.formas_pagamento || []).map(
                        (forma: string, index: number) => (
                          <Badge
                            key={index}
                            bg="secondary"
                            text="light"
                            className="prod-badge me-1"
                          >
                            {forma}
                          </Badge>
                        )
                      )
                    ) : (
                      <span>Não informado</span>
                    )}
                  </p>

                  <p
                    className={`prod-estoque ${
                      produto.estoque?.toLowerCase().includes('últimas')
                        ? 'prod-estoque-alerta'
                        : 'prod-estoque-normal'
                    }`}
                  >
                    <strong>Estoque:</strong> {produto.estoque || 'Indefinido'}
                  </p>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>

        {produtos.length > 6 && (
          <div className="text-center mt-4">
            <Button
              variant="primary"
              onClick={verMaisProdutos}
              aria-label="Ver mais produtos"
            >
              Ver mais produtos
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
