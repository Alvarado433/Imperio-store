'use client';

import useCards from "@/service/Hooks/cards";
import React from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { FaBoxOpen, FaTags } from "react-icons/fa";
// Importa o CSS separado

export default function UCards() {
  const { totalProdutos, totalCategorias, loading, error } = useCards();

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <div className="cards-grid">
      <Card className="shadow-lg card-custom card-produtos">
        <Card.Body className="card-body-custom">
          <FaBoxOpen size={48} className="mb-3" />
          <Card.Title className="card-title-custom">Total de Produtos</Card.Title>
          <Card.Text className="card-text-custom">{totalProdutos}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="shadow-lg card-custom card-categorias">
        <Card.Body className="card-body-custom">
          <FaTags size={48} className="mb-3" />
          <Card.Title className="card-title-custom">Total de Categorias</Card.Title>
          <Card.Text className="card-text-custom">{totalCategorias}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
