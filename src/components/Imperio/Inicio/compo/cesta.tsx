'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/service/Conexao/conn';
import { Dropdown, Row, Col, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Produto {
  id: number;
  nome: string;
}

interface Categoria {
  id: number;
  nome: string;
}

export default function Produtocate() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtosPorCategoria, setProdutosPorCategoria] = useState<{ [nome: string]: Produto[] }>({});
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  useEffect(() => {
    axios.get('/categorias/listrar')
      .then(res => setCategorias(res.data))
      .catch(err => console.error('Erro ao buscar categorias', err));
  }, []);

  const carregarProdutos = async (nome: string) => {
    setCategoriaAtiva(nome);
    setProdutoSelecionado(null); // limpa seleção ao mudar categoria
    if (produtosPorCategoria[nome]) return;

    setCarregando(true);
    try {
      const res = await axios.get(`/categorias/listrar/nome/${nome}`);
      setProdutosPorCategoria(prev => ({
        ...prev,
        [nome]: res.data.produtos
      }));
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setCarregando(false);
    }
  };

  const selecionarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto.id);
    router.push(`/produto/${produto.id}`);
  };

  return (
    <Dropdown className="position-static">
      <Dropdown.Toggle variant="light" id="dropdown-categorias">
        <i className="bi bi-grid-fill me-2" /> Categorias
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="w-100 p-3 shadow"
        style={{
          maxWidth: '800px',
          backgroundColor: '#ffc0cb',
          borderRadius: '8px',
          border: '1px solid #e08ca4',
          boxShadow: '0 4px 12px rgba(224, 140, 164, 0.4)'
        }}
      >
        <Row>
          {/* Coluna de Categorias */}
          <Col md={5} style={{ borderRight: '1px solid #e08ca4' }}>
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className={`py-2 px-3 rounded ${
                  categoriaAtiva === categoria.nome ? 'fw-bold text-white' : 'text-dark'
                } d-flex align-items-center justify-content-between`}
                onMouseEnter={() => carregarProdutos(categoria.nome)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: categoriaAtiva === categoria.nome ? '#e08ca4' : 'transparent',
                  transition: 'background-color 0.3s',
                  userSelect: 'none',
                }}
              >
                <div>
                  <i className="bi bi-folder-fill me-2"></i>
                  {categoria.nome}
                </div>

                <Link
                  href={`/categoria/${encodeURIComponent(categoria.nome)}`}
                  target="_blank"
                  onClick={e => e.stopPropagation()} // evitar disparar onMouseEnter ou seleção
                  className="text-white"
                  style={{ textDecoration: 'none', fontWeight: 'bold' }}
                  title={`Abrir categoria ${categoria.nome}`}
                >
                  <i className="bi bi-box-arrow-up-right"></i>
                </Link>
              </div>
            ))}
          </Col>

          {/* Coluna de Produtos */}
          <Col md={7}>
            <h6 className="text-white mb-3" style={{ fontWeight: 600 }}>
              {categoriaAtiva ? `Produtos de "${categoriaAtiva}"` : 'Selecione uma categoria'}
            </h6>

            {carregando ? (
              <Spinner animation="border" size="sm" variant="light" />
            ) : (
              <ul
                className="ps-0"
                style={{
                  listStyleType: 'none',
                  color: '#5a1a2a',
                  fontWeight: 500,
                }}
              >
                {produtosPorCategoria[categoriaAtiva || '']?.slice(0, 5).map((prod) => (
                  <li
                    key={prod.id}
                    onClick={() => selecionarProduto(prod)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: produtoSelecionado === prod.id ? '#e08ca4' : 'transparent',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      marginBottom: '6px',
                      transition: 'background-color 0.3s',
                      userSelect: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onMouseEnter={e => {
                      if (produtoSelecionado !== prod.id) e.currentTarget.style.backgroundColor = '#f9b7ca';
                    }}
                    onMouseLeave={e => {
                      if (produtoSelecionado !== prod.id) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>
                      <i className="bi bi-box-fill me-2"></i>
                      {prod.nome}
                    </span>

                    <Link
                      href={`/produto/${prod.id}`}
                      onClick={e => e.stopPropagation()}
                      className="text-muted"
                      title={`Ver produto ${prod.nome}`}
                      style={{ textDecoration: 'none' }}
                      target="_blank"
                    >
                      <i className="bi bi-box-arrow-up-right"></i>
                    </Link>
                  </li>
                ))}
                {!produtosPorCategoria[categoriaAtiva || '']?.length && !carregando && (
                  <li style={{ color: '#fff' }}>Nenhum produto encontrado.</li>
                )}
              </ul>
            )}
          </Col>
        </Row>
      </Dropdown.Menu>
    </Dropdown>
  );
}
