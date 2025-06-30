'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Table, Spinner, Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaImage, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import conn from '@/service/Conexao/conn';

interface Banner {
  id: number;
  titulo: string;
  imagem_blob: string | null;
  oferta: { titulo: string } | null;
  nivel: { nome: string } | null;
  ativo: boolean;
}

export default function BannerListar() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await conn.get('/banners/listar');
        setBanners(res.data);
      } catch (err) {
        setError('Erro ao carregar banners.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  const handleToggleAtivo = useCallback(
    async (id: number, ativo: boolean) => {
      try {
        await conn.patch(`/banners/${id}/ativar`, { ativo: !ativo });
        setBanners((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ativo: !ativo } : b))
        );
      } catch (err) {
        alert('Erro ao alterar status do banner.');
        console.error(err);
      }
    },
    []
  );

  const handleEditar = useCallback((id: number) => {
    alert(`Editar banner ${id} - implemente sua lógica aqui.`);
  }, []);

  const handleExcluir = useCallback(
    async (id: number) => {
      if (!confirm('Tem certeza que deseja excluir este banner?')) return;

      try {
        await conn.delete(`/banners/${id}/excluir`);
        setBanners((prev) => prev.filter((b) => b.id !== id));
      } catch (err) {
        alert('Erro ao excluir banner.');
        console.error(err);
      }
    },
    []
  );

  if (loading)
    return (
      <div className="d-flex justify-content-center my-4">
        <Spinner animation="border" role="status" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="m-4">
        {error}
      </Alert>
    );

  return (
    <div className="p-3">
      <h3 className="mb-4">Lista de Banners</h3>
      {banners.length === 0 ? (
        <p>Nenhum banner encontrado.</p>
      ) : (
        <Table striped bordered hover responsive className="align-middle text-center">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Imagem</th>
              <th>Oferta</th>
              <th>Nível</th>
              <th>Ativo</th>
              <th style={{ width: 160 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td>{banner.id}</td>
                <td className="text-start">{banner.titulo}</td>
                <td style={{ width: 140, height: 80, position: 'relative' }}>
                  {banner.imagem_blob ? (
                    <Image
                      src={`data:image/jpeg;base64,${banner.imagem_blob}`}
                      alt={banner.titulo}
                      fill
                      style={{ objectFit: 'contain', borderRadius: 4 }}
                      sizes="120px"
                      unoptimized // necessário para base64 inline
                    />
                  ) : (
                    <div
                      style={{
                        width: 120,
                        height: 70,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f0f0f0',
                        borderRadius: 4,
                        color: '#888',
                        fontSize: 24,
                        margin: 'auto',
                      }}
                      title="Sem imagem"
                    >
                      <FaImage />
                    </div>
                  )}
                </td>
                <td>{banner.oferta?.titulo ?? '-'}</td>
                <td>{banner.nivel?.nome ?? 'Todos'}</td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{banner.ativo ? 'Desativar' : 'Ativar'}</Tooltip>}
                  >
                    <Button
                      variant={banner.ativo ? 'success' : 'secondary'}
                      size="sm"
                      onClick={() => handleToggleAtivo(banner.id, banner.ativo)}
                      className="me-2"
                    >
                      {banner.ativo ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                    </Button>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditar(banner.id)}
                    >
                      <FaEdit />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Excluir</Tooltip>}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleExcluir(banner.id)}
                    >
                      <FaTrash />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
