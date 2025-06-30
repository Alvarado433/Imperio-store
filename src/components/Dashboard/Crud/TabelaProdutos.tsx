import React, { useState, useEffect } from "react";
import { Produto } from "@/types/types";
import { Spinner, Alert } from "react-bootstrap";
import TabelaProdutosLista from "../produto/produto";



interface TabelaProdutosContainerProps {
  produtos: Produto[];
  loading: boolean;
  error: string | null;
}

export default function TabelaProdutosContainer({
  produtos,
  loading,
  error,
}: TabelaProdutosContainerProps) {
  const [categoriaMap, setCategoriaMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const categorias: Record<number, string> = {};
    produtos.forEach((p) => {
      if (p.categoria_id && p.categoria && !categorias[p.categoria_id]) {
        categorias[p.categoria_id] = p.categoria.nome;
      }
    });
    setCategoriaMap(categorias);
  }, [produtos]);

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="my-4 text-center fs-5">
        {error}
      </Alert>
    );

  if (produtos.length === 0)
    return <p className="text-center my-4 fs-5 text-muted">Nenhum produto cadastrado.</p>;

  return <TabelaProdutosLista produtos={produtos} categoriaMap={categoriaMap} />;
}
