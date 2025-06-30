"use client";

import React, { useState, useEffect } from "react";
import { Offcanvas, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useCategorias } from "@/service/Hooks/Categorias";
import { useProdutos } from "@/Hooks/useProdutos";

interface PainelCadastraProdutoProps {
  show: boolean;
  onClose: () => void;
}

interface ProdutoPayload {
  nome: string;
  preco: number;
  categoria_id: number;
  parcelamento?: string | null;
  estoque: string;
  pix_valor?: number | null;
  formas_pagamento?: string[] | null;
}

export default function PainelCadastraProduto({
  show,
  onClose,
}: PainelCadastraProdutoProps) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [parcelamento, setParcelamento] = useState("");
  const [estoque, setEstoque] = useState("");
  const [pixValor, setPixValor] = useState("");
  const [formasPagamento, setFormasPagamento] = useState<string[]>([]);

  const {
    categorias,
    loading: loadingCategorias,
    error: errorCategorias,
  } = useCategorias(show);

  const { loading, errorMsg, successMsg, cadastrarProduto, resetMensagens } =
    useProdutos();

  useEffect(() => {
    if (!show) {
      limparCampos();
      resetMensagens();
    }
  }, [show, resetMensagens]);

  function limparCampos() {
    setNome("");
    setPreco("");
    setCategoriaId("");
    setParcelamento("");
    setEstoque("");
    setPixValor("");
    setFormasPagamento([]);
  }

  function toggleFormaPagamento(forma: string) {
    setFormasPagamento((prev) =>
      prev.includes(forma) ? prev.filter((f) => f !== forma) : [...prev, forma]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim() || !preco.trim() || !categoriaId || !estoque.trim()) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    const produtoPayload: ProdutoPayload = {
      nome: nome.trim(),
      preco: parseFloat(preco),
      categoria_id: parseInt(categoriaId),
      parcelamento: parcelamento.trim() || null,
      estoque: estoque.trim(),
      pix_valor: pixValor ? parseFloat(pixValor) : null,
      formas_pagamento: formasPagamento.length > 0 ? formasPagamento : null,
    };

    const sucesso = await cadastrarProduto(produtoPayload);
    if (sucesso) limparCampos();
  }

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" backdrop="static">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cadastrar Produto</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Nome *</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Preço *</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoria *</Form.Label>
            {loadingCategorias ? (
              <Spinner animation="border" size="sm" />
            ) : errorCategorias ? (
              <Alert variant="danger">{errorCategorias}</Alert>
            ) : (
              <Form.Select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Parcelamento</Form.Label>
            <Form.Control
              type="text"
              value={parcelamento}
              onChange={(e) => setParcelamento(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estoque *</Form.Label>
            <Form.Control
              type="text"
              value={estoque}
              onChange={(e) => setEstoque(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Valor Pix</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={pixValor}
              onChange={(e) => setPixValor(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Formas de Pagamento</Form.Label>
            <div className="d-flex gap-4">
              <Form.Check
                type="checkbox"
                label="Pix"
                checked={formasPagamento.includes("pix")}
                onChange={() => toggleFormaPagamento("pix")}
              />
              <Form.Check
                type="checkbox"
                label="Cartão"
                checked={formasPagamento.includes("cartao")}
                onChange={() => toggleFormaPagamento("cartao")}
              />
            </div>
          </Form.Group>

          <Button type="submit" disabled={loading} className="w-100">
            {loading ? (
              <>
                Cadastrando <Spinner animation="border" size="sm" />
              </>
            ) : (
              "Cadastrar Produto"
            )}
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
