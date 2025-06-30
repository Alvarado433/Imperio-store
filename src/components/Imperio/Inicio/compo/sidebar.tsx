'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Offcanvas, Form } from 'react-bootstrap';
import axios from '@/service/Conexao/conn';

interface SidebarProps {
  show: boolean;
  onHide: () => void;
}

interface Categoria {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
}

export default function Sidebar({ show, onHide }: SidebarProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    if (show) {
      setLoading(true);
      setError(null);
      axios.get('/categorias/listrar')
        .then(res => {
          setCategorias(res.data);
          setProdutos([]);
        })
        .catch(() => setError('Erro ao carregar categorias'))
        .finally(() => setLoading(false));
    }
  }, [show]);

  useEffect(() => {
    if (filtro.trim().length === 0) {
      setProdutos([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    axios.get(`/produtos/buscar?q=${encodeURIComponent(filtro)}`)
      .then(res => {
        setProdutos(res.data);
      })
      .catch(() => setError('Erro ao buscar produtos'))
      .finally(() => setLoading(false));

  }, [filtro]);

  const categoriasFiltradas = categorias.filter(cat =>
    cat.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      backdrop={true}
      placement="start"
      style={{
        width: '280px',
        height: '100vh',
        background: 'linear-gradient(135deg, #b85c5c, #7a2a2a)',
        color: '#fff',
        boxShadow: '4px 0 12px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="custom-sidebar"
    >
      <Offcanvas.Header closeButton closeVariant="white" style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />

      <Offcanvas.Body
        style={{
          paddingTop: '1rem',
          paddingBottom: '1rem',
          overflowY: 'auto',
          flexGrow: 1,
        }}
      >
        <Form.Control
          type="search"
          placeholder="Pesquisar categorias e produtos..."
          aria-label="Pesquisar categorias e produtos"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{
            marginBottom: '1rem',
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#fff',
            fontWeight: 600, // CORRIGIDO AQUI
          }}
          className="text-white"
        />

        {loading && <p style={{ color: '#fbeaea' }}>Carregando...</p>}
        {error && <p style={{ color: '#ff6666' }}>{error}</p>}

        {filtro.trim() ? (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <h6 style={{ color: '#fbeaea' }}>Categorias</h6>
              {categoriasFiltradas.length === 0 && <p style={{ color: '#fbeaea' }}>Nenhuma categoria encontrada.</p>}
              {categoriasFiltradas.map(cat => (
                <Link
                  key={cat.id}
                  href={`/categoria/${encodeURIComponent(cat.nome)}`}
                  onClick={onHide}
                  style={{
                    display: 'block',
                    padding: '6px 12px',
                    color: '#fbeaea',
                    fontWeight: 600, // CORRIGIDO AQUI
                    fontSize: '1rem',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    marginBottom: '0.3rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {cat.nome}
                </Link>
              ))}
            </div>

            <div>
              <h6 style={{ color: '#fbeaea' }}>Produtos</h6>
              {produtos.length === 0 && <p style={{ color: '#fbeaea' }}>Nenhum produto encontrado.</p>}
              {produtos.map(prod => (
                <Link
                  key={prod.id}
                  href={`/produto/${prod.id}`}
                  onClick={onHide}
                  style={{
                    display: 'block',
                    padding: '6px 12px',
                    color: '#fbeaea',
                    fontWeight: 600, // CORRIGIDO AQUI
                    fontSize: '1rem',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    marginBottom: '0.3rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {prod.nome}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <>
            <h6 style={{ color: '#fbeaea' }}>Categorias</h6>
            {categorias.length === 0 && !loading && !error && <p style={{ color: '#fbeaea' }}>Nenhuma categoria encontrada.</p>}
            {categorias.map(cat => (
              <Link
                key={cat.id}
                href={`/categoria/${encodeURIComponent(cat.nome)}`}
                onClick={onHide}
                style={{
                  display: 'block',
                  padding: '10px 15px',
                  color: '#fbeaea',
                  fontWeight: 600, // CORRIGIDO AQUI
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {cat.nome}
              </Link>
            ))}
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
