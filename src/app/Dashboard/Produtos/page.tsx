"use client";

import React, { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";

import TabelaProdutos from "@/components/Dashboard/Crud/TabelaProdutos";
import { useProduto } from "@/service/Hooks/Produtos";
import PainelCadastraProduto from "@/components/Dashboard/Crud/modal";

export default function CadastraProdutos() {
  const [showPainel, setShowPainel] = useState(false);
  const { produtos, loading, error } = useProduto();

  const openPainel = () => setShowPainel(true);
  const closePainel = () => setShowPainel(false);

  return (
    <Container fluid="md" className="container-md py-4">
      <Row className="mb-3">
        <Col xs={12} className="d-flex justify-content-start">
          <Button variant="primary" onClick={openPainel} className="btn-primary">
            Cadastrar Novo Produto
          </Button>
        </Col>
      </Row>

      <PainelCadastraProduto show={showPainel} onClose={closePainel} />

      <Row>
        <Col xs={12}>
          <div className="table-wrapper">
            <TabelaProdutos
              produtos={produtos}
              loading={loading}
              error={error}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
