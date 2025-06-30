'use client';

import React, { useState } from 'react';
import { Truck, ShoppingCart, PackageSearch, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import conn from '@/service/Conexao/conn';

interface Produto {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  categoria?: string;
}

interface ProdutoCardProps {
  produto: Produto;
  onAddToCart: (produtoId: number, cep: string, cupomCodigo?: string) => void;
}

interface Endereco {
  localidade: string;
  uf: string;
}

export default function ProdutoCard({ produto, onAddToCart }: ProdutoCardProps) {
  const [cep, setCep] = useState('');
  const [imagemSelecionadaIndex, setImagemSelecionadaIndex] = useState(0);
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [frete, setFrete] = useState<string | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepErro, setCepErro] = useState<string | null>(null);
  const [cupomCodigo, setCupomCodigo] = useState<string | null>(null);

  const trocarImagem = (index: number) => setImagemSelecionadaIndex(index);

  const formatarCep = (valor: string) => {
    const nums = valor.replace(/\D/g, '');
    if (nums.length > 5) return nums.slice(0, 5) + '-' + nums.slice(5, 8);
    return nums;
  };

  const consultarCep = async (cepParaConsultar: string) => {
    setLoadingCep(true);
    setCepErro(null);
    setEndereco(null);
    setFrete(null);
    setCupomCodigo(null);

    try {
      const cepLimpo = cepParaConsultar.replace(/\D/g, '');
      if (cepLimpo.length !== 8) {
        setCepErro('CEP inválido. Deve conter 8 números.');
        return;
      }

      const response = await conn.get(`/cep/${cepLimpo}`);
      const data = response.data;

      if (data.erro) {
        setCepErro('CEP não encontrado.');
        return;
      }

      setEndereco({ localidade: data.localidade, uf: data.uf });

      if (cepLimpo.startsWith('0') || cepLimpo.startsWith('1')) {
        setFrete('Grátis');

        try {
          const resCupomExistente = await conn.get('/cupons/frete-gratis-24h/ativo');
          if (resCupomExistente.status === 200 && resCupomExistente.data.codigo) {
            setCupomCodigo(resCupomExistente.data.codigo);
          } else {
            await criarNovoCupomFreteGratis();
          }
        } catch {
          await criarNovoCupomFreteGratis();
        }
      } else {
        setFrete('R$ 15,00');
      }
    } catch {
      setCepErro('Erro ao consultar CEP.');
    } finally {
      setLoadingCep(false);
    }
  };

  const criarNovoCupomFreteGratis = async () => {
    const codigoGerado = 'FRETEGRATIS-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    try {
      const res = await conn.post('/cupons/frete-gratis-24h', { codigo: codigoGerado });
      if (res.status === 201) {
        setCupomCodigo(codigoGerado);
      } else {
        setCepErro('Erro ao gerar cupom de frete grátis.');
      }
    } catch {
      setCepErro('Erro ao comunicar com o servidor para gerar cupom.');
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarCep(e.target.value);
    setCep(valorFormatado);

    if (valorFormatado.length === 9) {
      consultarCep(valorFormatado);
    } else {
      setEndereco(null);
      setFrete(null);
      setCepErro(null);
      setCupomCodigo(null);
    }
  };

  const handleAddToCart = () => {
    if (!cep) {
      alert('Por favor, insira o CEP antes de adicionar ao carrinho.');
      return;
    }
    if (!endereco) {
      alert('Por favor, insira um CEP válido e aguarde a validação.');
      return;
    }
    onAddToCart(produto.id, cep, cupomCodigo || undefined);
  };

  const precoPix = (produto.price * 0.9).toFixed(2);
  const parcela = (produto.price / 12).toFixed(2);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .produto-container {
            flex-direction: column !important;
            padding: 16px !important;
          }
          .produto-imagens-detalhes {
            flex-direction: column !important;
          }
          .miniaturas-imagens {
            flex-direction: row !important;
            justify-content: center !important;
            margin-bottom: 16px !important;
            max-height: none !important;
          }
          .miniaturas-imagens img {
            margin: 0 8px !important;
            cursor: pointer;
          }
          .imagem-principal {
            width: 100% !important;
            max-width: 320px !important;
            height: auto !important;
            margin: 0 auto 20px auto !important;
          }
          .detalhes-produto {
            padding: 0 12px !important;
          }
          .caixa-lateral {
            flex: none !important;
            width: 100% !important;
            margin-top: 24px !important;
          }
          .botao-adicionar {
            width: 100% !important;
            justify-content: center !important;
            padding: 14px 0 !important;
          }
          nav {
            font-size: 0.8rem !important;
          }
        }
      `}</style>

      {/* Breadcrumb */}
      <nav style={{ marginBottom: 24, fontSize: '0.85rem', color: '#7a2048' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#bb5478' }}>Início</Link>{' > '}
        <Link href="/produtos" style={{ textDecoration: 'none', color: '#bb5478' }}>Produtos</Link>{' > '}
        <span>{produto.name}</span>
      </nav>

      {/* Container */}
      <div className="produto-container" style={{
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
        background: '#fff0f5',
        padding: 28,
        borderRadius: 16,
        boxShadow: '0 6px 20px rgba(173, 54, 87, 0.25)',
        color: '#55182b',
      }}>
        {/* Imagens + detalhes */}
        <div className="produto-imagens-detalhes" style={{ flex: 1, minWidth: 280, display: 'flex', gap: 20 }}>
          {/* Miniaturas */}
          <div className="miniaturas-imagens" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            maxHeight: 360,
            overflowY: 'auto',
            cursor: 'pointer',
          }}>
            {produto.images.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`Miniatura ${i + 1}`}
                width={60}
                height={60}
                onClick={() => trocarImagem(i)}
                style={{
                  borderRadius: 8,
                  objectFit: 'cover',
                  opacity: i === imagemSelecionadaIndex ? 1 : 0.7,
                  border: i === imagemSelecionadaIndex ? '2px solid #7a2048' : '1px solid #bb5478',
                  marginBottom: 8,
                }}
              />
            ))}
          </div>

          {/* Imagem principal */}
          <Image
            className="imagem-principal"
            src={produto.images[imagemSelecionadaIndex]}
            alt={produto.name}
            width={320}
            height={360}
            style={{
              objectFit: 'contain',
              borderRadius: 12,
              background: '#ffe6f0',
              boxShadow: '0 4px 14px rgba(122, 32, 72, 0.3)',
            }}
          />

          {/* Detalhes */}
          <div className="detalhes-produto" style={{ flex: 1, paddingLeft: 12 }}>
            <h1 style={{ color: '#7a2048' }}>
              <PackageSearch size={22} style={{ marginRight: 8 }} />
              {produto.name}
            </h1>

            {produto.categoria && (
              <p style={{ fontSize: '0.95rem' }}>
                <Tag size={14} style={{ marginRight: 6, color: '#bb5478' }} />
                Categoria: <strong>{produto.categoria}</strong>
              </p>
            )}

            <p style={{ fontSize: '1.6rem', fontWeight: 600, color: '#7a2048' }}>
              R$ {produto.price.toFixed(2)}
            </p>

            <p style={{ fontSize: '1rem', color: '#2e7d32' }}>
              Pix: <strong>R$ {precoPix}</strong> (10% de desconto)
            </p>

            <p style={{ fontSize: '0.95rem', color: '#4a4a4a' }}>
              em até <strong>12x</strong> de <strong>R$ {parcela}</strong> sem juros
            </p>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#55182b' }}>{produto.description}</p>
          </div>
        </div>

        {/* Caixa lateral */}
        <div className="caixa-lateral" style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={handleAddToCart} className="botao-adicionar" style={{
            backgroundColor: '#7a2048',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.1rem',
            padding: '14px 32px',
            borderRadius: 14,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(122, 32, 72, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'center',
          }}>
            <ShoppingCart size={20} /> Adicionar ao Carrinho
          </button>

          <div style={{
            background: '#ffe6f0',
            border: '1px solid #bb5478',
            padding: 16,
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <label htmlFor="cep" style={{ fontWeight: 700, color: '#7a2048', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Truck size={18} /> CEP de entrega
            </label>
            <input
              id="cep"
              type="text"
              placeholder="00000-000"
              value={cep}
              onChange={handleCepChange}
              maxLength={9}
              style={{
                padding: 10,
                fontSize: '1rem',
                borderRadius: 10,
                border: '2px solid #bb5478',
                outline: 'none',
              }}
            />
            {loadingCep && <p style={{ fontSize: '0.9rem', color: '#999' }}>Consultando CEP...</p>}
            {cepErro && <p style={{ color: '#b30059', fontWeight: 700 }}>{cepErro}</p>}
            {endereco && !cepErro && (
              <p style={{ fontWeight: 600, color: '#008000' }}>
                Entrega: {endereco.localidade} - {endereco.uf} <br />
                Frete: <strong>{frete}</strong>
              </p>
            )}
            {cupomCodigo && (
              <p style={{ color: '#008000', fontWeight: 700 }}>
                Cupom frete grátis gerado: <strong>{cupomCodigo}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
