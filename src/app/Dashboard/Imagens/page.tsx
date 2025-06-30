'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Form,
  Spinner,
  Alert,
  Card,
  Modal,
  Carousel,
  Container,
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaExpand, FaPlus } from 'react-icons/fa';
import { useProduto } from '@/service/Hooks/Produtos';
import Image from 'next/image';

const styles = {
  container: {
    maxWidth: 960,
    padding: '2rem 1rem',
    margin: '0 auto',
  },
  title: {
    color: '#444',
    fontWeight: 600,
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
  },
  buttonUpload: {
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
  },
  carouselContainer: {
    boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  carouselImageWrapper: {
    position: 'relative' as const,
    width: '100%',
    height: 450,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '0.8rem',
  },
  smallText: {
    marginTop: '0.8rem',
    color: '#666',
    fontSize: '0.9rem',
    textAlign: 'center' as const,
  },
  alertCenter: {
    textAlign: 'center' as const,
  },
};

export default function CadastroImagemCard() {
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const {
    uploadImagem,
    fetchImagens,
    imagens,
    loading,
    error,
    success,
    clearMessages,
  } = useProduto();

  const fetchImagensCallback = useCallback(() => {
    fetchImagens();
  }, [fetchImagens]);

  useEffect(() => {
    fetchImagensCallback();
  }, [fetchImagensCallback]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearMessages();
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result?.toString().split(',')[1] ?? null;
      setFileBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileBase64) return;

    try {
      await uploadImagem({
        id: 0,
        produto_id: null,
        imagem_base64: fileBase64,
      });
      setFileBase64(null);
      (document.getElementById('input-file') as HTMLInputElement).value = '';
      await fetchImagens();
      setShowUploadModal(false);
    } catch {}
  };

  const handleOpenViewModal = (base64: string) => {
    setModalImage(base64);
    setShowViewModal(true);
  };

  return (
    <Container style={styles.container}>
      <h2 style={styles.title}>Cadastro de Imagens</h2>

      <div style={styles.buttonUpload}>
        <Button variant="success" onClick={() => setShowUploadModal(true)}>
          <FaPlus style={{ marginRight: 6 }} /> Cadastrar Imagem
        </Button>
      </div>

      {imagens.length === 0 ? (
        <Alert variant="secondary" style={styles.alertCenter}>
          Nenhuma imagem cadastrada.
        </Alert>
      ) : (
        <Card style={styles.carouselContainer}>
          <Carousel interval={null} indicators variant="dark">
            {imagens.map((img) => (
              <Carousel.Item key={img.id}>
                <div style={styles.carouselImageWrapper}>
                  <Image
                    src={`data:image/jpeg;base64,${img.imagem_base64}`}
                    alt={`Imagem ${img.id}`}
                    layout="fill"
                    objectFit="contain"
                    onClick={() => handleOpenViewModal(img.imagem_base64 || '')}
                  />
                </div>
                <Carousel.Caption>
                  <div style={styles.buttonGroup}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      title="Editar"
                      onClick={() => alert('Funcionalidade de edição aqui')}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      title="Excluir"
                      onClick={() => alert('Funcionalidade de exclusão aqui')}
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      title="Visualizar"
                      onClick={() => handleOpenViewModal(img.imagem_base64 || '')}
                    >
                      <FaExpand />
                    </Button>
                  </div>
                  <small style={styles.smallText}>
                    ID: {img.id} — Produto: {img.produto_id ?? '—'}
                  </small>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Card>
      )}

      {/* Modal Upload */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
        size="sm"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Nova Imagem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" style={styles.alertCenter}>{error}</Alert>}
          {success && <Alert variant="success" style={styles.alertCenter}>{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="input-file" className="mb-3">
              <Form.Label>Selecione a imagem</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                id="input-file"
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={loading || !fileBase64}
              className="w-100"
              size="lg"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Salvando...
                </>
              ) : (
                'Salvar Imagem'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Visualizar Imagem */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Body className="p-0 text-center">
          {modalImage && (
            <div style={{ position: 'relative', width: '100%', height: 450 }}>
              <Image
                src={`data:image/jpeg;base64,${modalImage}`}
                alt="Visualização Ampliada"
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
