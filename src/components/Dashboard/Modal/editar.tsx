'use client';

import React, { useState, useEffect, FormEvent, ChangeEventHandler } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Produto } from '@/types/types';

interface ModalEditarProdutoProps {
  show: boolean;
  onHide: () => void;
  produto: Produto | null;
  onSalvar: (produtoEditado: Produto) => void;
}

const formasPagamentoOpcoes = ['pix', 'cartao', 'boleto'];

export default function ModalEditarProduto({
  show,
  onHide,
  produto,
  onSalvar,
}: ModalEditarProdutoProps) {
  const [form, setForm] = useState<Produto>({ ...produto } as Produto);

  useEffect(() => {
    if (produto) {
      setForm(produto);
    }
  }, [produto]);

  // Atualiza campos simples
  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'preco' || name === 'pix_valor'
          ? value === ''
            ? null
            : parseFloat(value)
          : name === 'estoque' || name === 'parcelamento'
          ? value
          : value,
    }));
  };

  // Checkbox para formas de pagamento
  const handleFormaPagamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let novasFormas = form.formas_pagamento ? [...form.formas_pagamento] : [];

    if (checked) {
      if (!novasFormas.includes(value)) {
        novasFormas.push(value);
      }
    } else {
      novasFormas = novasFormas.filter((f) => f !== value);
    }

    setForm((prev) => ({
      ...prev,
      formas_pagamento: novasFormas,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSalvar(form);
    onHide();
  };

  if (!produto) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Produto #{produto.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Preço</Form.Label>
                <Form.Control
                  type="number"
                  name="preco"
                  value={form.preco ?? ''}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Parcelamento</Form.Label>
                <Form.Control
                  type="text"
                  name="parcelamento"
                  value={form.parcelamento ?? ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Estoque</Form.Label>
            <Form.Control
              type="text"
              name="estoque"
              value={form.estoque}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Pix Valor</Form.Label>
            <Form.Control
              type="number"
              name="pix_valor"
              value={form.pix_valor ?? ''}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Formas de Pagamento</Form.Label>
            <div>
              {formasPagamentoOpcoes.map((fp) => (
                <Form.Check
                  inline
                  key={fp}
                  label={fp.toUpperCase()}
                  type="checkbox"
                  value={fp}
                  checked={form.formas_pagamento?.includes(fp) ?? false}
                  onChange={handleFormaPagamentoChange}
                />
              ))}
            </div>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Salvar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
