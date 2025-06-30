'use client';

import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Container } from 'react-bootstrap';
import conn from '@/service/Conexao/conn';
import Image from 'next/image';

interface Oferta {
  id: number;
  titulo: string;
}

interface Nivel {
  id: number;
  nome: string;
}

function useOfertas() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  useEffect(() => {
    conn.get('/ofertas/listrar').then(res => setOfertas(res.data));
  }, []);
  return { ofertas };
}

function useNiveis() {
  const [niveis, setNiveis] = useState<Nivel[]>([]);
  useEffect(() => {
    conn.get('/nivel/listar').then(res => setNiveis(res.data));
  }, []);
  return { niveis };
}

export default function BannerPage() {
  const [titulo, setTitulo] = useState('');
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [ofertaId, setOfertaId] = useState('');
  const [nivelId, setNivelId] = useState('');

  const { ofertas } = useOfertas();
  const { niveis } = useNiveis();

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(',')[1];
      setImagemBase64(base64String || null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      titulo,
      imagem_base64: imagemBase64,
      oferta_id: parseInt(ofertaId),
      nivel_id: nivelId ? parseInt(nivelId) : null,
    };

    try {
      await conn.post('/banners/cadastrar', payload);
      setTitulo('');
      setImagemBase64(null);
      setOfertaId('');
      setNivelId('');
      alert('Banner cadastrado com sucesso!');
    } catch (error: unknown) {
      console.error('Erro ao cadastrar banner:', error);
      alert('Erro ao cadastrar banner.');
    }
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm rounded-4">
        <h4 className="mb-3">Cadastrar Novo Banner</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagem</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImagemChange}
              accept="image/*"
              required
            />
            {imagemBase64 && (
              <div style={{ position: 'relative', width: '100%', height: 200 }} className="mt-3">
                <Image
                  src={`data:image/jpeg;base64,${imagemBase64}`}
                  alt="Preview"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Oferta</Form.Label>
                <Form.Select
                  value={ofertaId}
                  onChange={e => setOfertaId(e.target.value)}
                  required
                >
                  <option value="">Selecione uma oferta</option>
                  {ofertas.map(oferta => (
                    <option key={oferta.id} value={oferta.id}>
                      {oferta.titulo}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nível</Form.Label>
                <Form.Select
                  value={nivelId}
                  onChange={e => setNivelId(e.target.value)}
                >
                  <option value="">Todos os níveis</option>
                  {niveis.map(nivel => (
                    <option key={nivel.id} value={nivel.id}>
                      {nivel.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Cadastrar Banner
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
