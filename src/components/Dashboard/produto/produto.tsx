'use client';

import React, { useState } from "react";
import { Produto } from "@/types/types";
import { Table, Button, Image, Badge } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye, FaImage, FaPlusCircle } from "react-icons/fa";
import Swal from "sweetalert2";

import { excluirProduto } from "@/service/Hooks/excluirProduto";
import ModalEditarProduto from "../Modal/editar";
import ModalCadastrarImagem from "../Modal/ModalCadastrarImagem";
import ModalVisualizarProduto from "../Modal/ModalVisualizarProduto";

interface TabelaProdutosListaProps {
  produtos: Produto[];
  categoriaMap: Record<number, string>;
}

export default function TabelaProdutosLista({ produtos, categoriaMap }: TabelaProdutosListaProps) {
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [showModalVisualizar, setShowModalVisualizar] = useState(false);
  const [showModalCadastrarImagem, setShowModalCadastrarImagem] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);

  const abrirModalVisualizar = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setShowModalVisualizar(true);
  };

  const abrirModalCadastrarImagem = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setShowModalCadastrarImagem(true);
  };

  const abrirModalEditar = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setShowModalEditar(true);
  };

  const fecharModais = () => {
    setShowModalVisualizar(false);
    setShowModalCadastrarImagem(false);
    setShowModalEditar(false);
    setProdutoSelecionado(null);
  };

  const handleSalvarEdicao = (produtoEditado: Produto) => {
    console.log("Produto editado:", produtoEditado);
    fecharModais();
    // Se quiser recarregar após edição:
    // location.reload();
  };

  const confirmarExclusao = (produto: Produto) => {
    Swal.fire({
      title: `Excluir produto #${produto.id}?`,
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await excluirProduto(produto.id);
          Swal.fire("Excluído!", res.mensagem, "success").then(() => {
            location.reload(); // Recarrega a página após exclusão
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            Swal.fire("Erro", error.message, "error");
          } else {
            Swal.fire("Erro", "Erro desconhecido ao excluir o produto.", "error");
          }
        }
      }
    });
  };

  const montarSrcBase64 = (base64: string | null, tipo = "jpeg") =>
    base64 ? `data:image/${tipo};base64,${base64}` : "";

  return (
    <>
      <div className="table-responsive-wrapper">
        <Table
          responsive
          className="product-table"
          style={{ minWidth: 1100, borderCollapse: "separate", borderSpacing: "0 12px" }}
          hover
        >
          <thead>
            <tr className="table-header">
              <th className="rounded-start ps-4">#ID</th>
              <th>Nome</th>
              <th className="hide-sm">Preço</th>
              <th className="hide-xs">Categoria</th>
              <th className="hide-sm">Parcelamento</th>
              <th className="hide-xs">Estoque</th>
              <th className="hide-sm">Pix Valor</th>
              <th className="hide-xs">Formas de Pagamento</th>
              <th className="text-center"><FaImage title="Imagens" /></th>
              <th className="text-center">Miniaturas</th>
              <th className="rounded-end text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => {
              const qtdImagens = produto.imagens?.length || 0;
              const miniaturas = produto.imagens?.slice(0, 3) || [];

              return (
                <tr key={produto.id} className="product-row">
                  <td className="ps-4 fw-bold text-primary">{produto.id}</td>
                  <td className="text-start fw-semibold">{produto.nome}</td>
                  <td className="hide-sm text-success">R$ {produto.preco.toFixed(2)}</td>
                  <td className="hide-xs">
                    {produto.categoria?.nome || categoriaMap[produto.categoria_id] || "-"}
                  </td>
                  <td className="hide-sm">{produto.parcelamento || "-"}</td>
                  <td className="hide-xs">{produto.estoque}</td>
                  <td className="hide-sm text-info">
                    {produto.pix_valor !== undefined && produto.pix_valor !== null
                      ? `R$ ${produto.pix_valor.toFixed(2)}`
                      : "-"}
                  </td>
                  <td
                    className="hide-xs"
                    style={{
                      maxWidth: 180,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={
                      Array.isArray(produto.formas_pagamento)
                        ? produto.formas_pagamento.join(", ")
                        : produto.formas_pagamento || ""
                    }
                  >
                    {Array.isArray(produto.formas_pagamento)
                      ? produto.formas_pagamento.join(", ")
                      : produto.formas_pagamento || "-"}
                  </td>
                  <td className="text-center text-muted fw-bold" style={{ fontSize: 18 }}>
                    {qtdImagens}
                  </td>
                  <td className="text-center">
                    <div className="miniaturas-container">
                      {miniaturas.map((img, idx) => (
                        <Image
                          key={idx}
                          src={montarSrcBase64(img.imagem_base64)}
                          alt={`Miniatura ${idx + 1} do produto`}
                          width={40}
                          height={40}
                          className="rounded border me-1"
                          style={{ objectFit: "cover" }}
                        />
                      ))}
                      {qtdImagens > 3 && (
                        <Badge bg="secondary" className="plus-badge">
                          +{qtdImagens - 3}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2"
                      title="Visualizar"
                      onClick={() => abrirModalVisualizar(produto)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      title="Editar"
                      onClick={() => abrirModalEditar(produto)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-2"
                      title="Excluir"
                      onClick={() => confirmarExclusao(produto)}
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      title="Cadastrar Imagem"
                      onClick={() => abrirModalCadastrarImagem(produto)}
                    >
                      <FaPlusCircle />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Modais */}
      <ModalVisualizarProduto
        show={showModalVisualizar}
        onHide={fecharModais}
        produto={produtoSelecionado}
        categoriaMap={categoriaMap}
      />

      <ModalCadastrarImagem
        show={showModalCadastrarImagem}
        onHide={fecharModais}
        produto={produtoSelecionado}
      />

      <ModalEditarProduto
        show={showModalEditar}
        onHide={fecharModais}
        produto={produtoSelecionado}
        onSalvar={handleSalvarEdicao}
      />
    </>
  );
}
