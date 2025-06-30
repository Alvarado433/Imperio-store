"use client";

import React from "react";
import { Modal, Button, Image, Row, Col, Spinner, Badge } from "react-bootstrap";
import { Produto } from "@/types/types";
import {
  FaTag,
  FaBoxOpen,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaWarehouse,
  FaImages,
  FaCreditCard,
} from "react-icons/fa";

interface ModalVisualizarProdutoProps {
  show: boolean;
  onHide: () => void;
  produto: Produto | null;
  categoriaMap: Record<number, string>;
}

export default function ModalVisualizarProduto({
  show,
  onHide,
  produto,
  categoriaMap,
}: ModalVisualizarProdutoProps) {
  // Monta a URL base64 para a imagem, trata null retornando string vazia
  const montarSrcBase64 = (base64: string | null, tipo = "jpeg") =>
    base64 ? `data:image/${tipo};base64,${base64}` : "";

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <FaBoxOpen size={24} /> Detalhes do Produto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!produto ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <h3 className="mb-4 text-primary">{produto.nome}</h3>
            <Row className="mb-3">
              <Col md={6} className="mb-2">
                <strong>ID:</strong> <Badge bg="secondary">{produto.id}</Badge>
              </Col>
              <Col md={6} className="mb-2 d-flex align-items-center">
                <FaTag className="me-2 text-warning" />
                <strong>Categoria:</strong>&nbsp;
                <span>{produto.categoria?.nome || categoriaMap[produto.categoria_id] || "-"}</span>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4} className="mb-2 d-flex align-items-center">
                <FaMoneyBillWave className="me-2 text-success" />
                <strong>Preço:</strong>&nbsp; R$ {produto.preco.toFixed(2)}
              </Col>
              <Col md={4} className="mb-2 d-flex align-items-center">
                <FaMoneyBillWave className="me-2 text-success" />
                <strong>Pix Valor:</strong>&nbsp;
                {produto.pix_valor ? `R$ ${produto.pix_valor.toFixed(2)}` : "-"}
              </Col>
              <Col md={4} className="mb-2 d-flex align-items-center">
                <FaCalendarAlt className="me-2 text-info" />
                <strong>Parcelamento:</strong>&nbsp; {produto.parcelamento || "-"}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6} className="mb-2 d-flex align-items-center">
                <FaWarehouse className="me-2 text-secondary" />
                <strong>Estoque:</strong>&nbsp; {produto.estoque}
              </Col>
              <Col md={6} className="mb-2 d-flex align-items-center flex-wrap">
                <FaCreditCard className="me-2 text-primary" />
                <strong>Formas de Pagamento:</strong>&nbsp;
                {produto.formas_pagamento?.length
                  ? produto.formas_pagamento.map((fp) => (
                      <Badge bg="info" key={fp} className="me-1">
                        {fp.toUpperCase()}
                      </Badge>
                    ))
                  : "-"}
              </Col>
            </Row>

            <hr />

            <div className="mb-3 d-flex align-items-center gap-2">
              <FaImages size={20} />
              <h5 className="mb-0">Imagens ({produto.imagens?.length || 0})</h5>
            </div>

            {produto.imagens && produto.imagens.length > 0 ? (
              <Row className="g-3">
                {produto.imagens.map((img, idx) =>
                  img.imagem_base64 ? (
                    <Col key={img.id ?? idx} xs={6} sm={4} md={3} lg={2}>
                      <Image
                        src={montarSrcBase64(img.imagem_base64)}
                        alt={`Imagem ${idx + 1}`}
                        className="rounded border"
                        style={{ objectFit: "cover", height: "150px", width: "100%" }}
                        thumbnail
                      />
                    </Col>
                  ) : null
                )}
              </Row>
            ) : (
              <p className="text-muted">Nenhuma imagem disponível para este produto.</p>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
