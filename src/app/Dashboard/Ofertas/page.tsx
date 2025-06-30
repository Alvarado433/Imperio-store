'use client';

import { useState, useEffect } from "react";
import conn from "@/service/Conexao/conn";
import {
  Button,
  Form,
  Table,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { OfertaForm } from "@/types/types";

type Oferta = {
  id: number;
  titulo: string;
  descricao?: string;
  desconto: number | string;
  data_inicio?: string;
  data_fim?: string;
  produto_id: number | null;
  produtos_ids?: number[];
};

export default function OfertasListar() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<{ id: number; nome: string }[]>([]);

  const [showPanel, setShowPanel] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOfertaId, setEditingOfertaId] = useState<number | null>(null);

  const [novaOferta, setNovaOferta] = useState<OfertaForm>({
    titulo: "",
    descricao: "",
    desconto: "",
    data_inicio: "",
    data_fim: "",
    produto_id: null,
    produtos_ids: [],
  });

  const [mensagem, setMensagem] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"success" | "danger">("success");

  // Buscar ofertas
  const fetchOfertas = async () => {
    setLoading(true);
    try {
      const res = await conn.get<Oferta[]>("/ofertas/listrar");
      setOfertas(res.data);
      setError(null);
    } catch {
      setError("Erro ao buscar ofertas.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar produtos para select
  const fetchProdutos = async () => {
    try {
      const res = await conn.get<{ id: number; nome: string }[]>("/produtos/listrar");
      setProdutos(res.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchOfertas();
    fetchProdutos();
  }, []);

  // Manipuladores do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "desconto") {
      setNovaOferta((prev) => ({ ...prev, desconto: value === "" ? "" : value }));
    } else {
      setNovaOferta((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiProdutoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (option) => parseInt(option.value, 10));
    setNovaOferta((prev) => ({
      ...prev,
      produtos_ids: options,
      produto_id: options.includes(prev.produto_id ?? -1) ? prev.produto_id : null,
    }));
  };

  // Abrir painel para nova oferta
  const abrirCadastro = () => {
    setNovaOferta({
      titulo: "",
      descricao: "",
      desconto: "",
      data_inicio: "",
      data_fim: "",
      produto_id: null,
      produtos_ids: [],
    });
    setIsEditMode(false);
    setEditingOfertaId(null);
    setShowPanel(true);
  };

  // Abrir painel para editar oferta
  const abrirEdicao = (oferta: Oferta) => {
    setNovaOferta({
      titulo: oferta.titulo,
      descricao: oferta.descricao || "",
      desconto: oferta.desconto.toString(),
      data_inicio: oferta.data_inicio ? oferta.data_inicio.split("T")[0] : "",
      data_fim: oferta.data_fim ? oferta.data_fim.split("T")[0] : "",
      produto_id: oferta.produto_id,
      produtos_ids: oferta.produtos_ids || [],
    });
    setIsEditMode(true);
    setEditingOfertaId(oferta.id);
    setShowPanel(true);
  };

  // Excluir oferta
  const excluirOferta = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir essa oferta?")) return;
    try {
      await conn.delete(`/ofertas/excluir/${id}`);
      setMensagem("Oferta excluída com sucesso.");
      setAlertVariant("success");
      fetchOfertas();
    } catch {
      setMensagem("Erro ao excluir oferta.");
      setAlertVariant("danger");
    }
  };

  // Associar produtos: abrir modal para associação
  const [showAssociarModal, setShowAssociarModal] = useState(false);
  const [ofertaAssociarId, setOfertaAssociarId] = useState<number | null>(null);
  const [produtosSelecionados, setProdutosSelecionados] = useState<number[]>([]);

  const abrirAssociar = (oferta: Oferta) => {
    setOfertaAssociarId(oferta.id);
    setProdutosSelecionados(oferta.produtos_ids || []);
    setShowAssociarModal(true);
  };

  const handleAssociarProdutosChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (option) => parseInt(option.value, 10));
    setProdutosSelecionados(options);
  };

  const salvarAssociarProdutos = async () => {
    if (ofertaAssociarId === null) return;

    try {
      await conn.put(`/ofertas/${ofertaAssociarId}/produtos`, {
        produtos_ids: produtosSelecionados,
      });
      setMensagem("Produtos associados atualizados com sucesso.");
      setAlertVariant("success");
      setShowAssociarModal(false);
      fetchOfertas();
    } catch {
      setMensagem("Erro ao atualizar associação de produtos.");
      setAlertVariant("danger");
    }
  };

  // Salvar nova oferta ou edição
  const handleSubmit = async () => {
    if (
      !novaOferta.titulo ||
      novaOferta.desconto === "" ||
      novaOferta.produtos_ids.length === 0 ||
      novaOferta.produto_id === null
    ) {
      setMensagem("Preencha todos os campos obrigatórios: Título, Desconto, Produtos e Produto Principal.");
      setAlertVariant("danger");
      return;
    }

    try {
      if (isEditMode && editingOfertaId) {
        await conn.put(`/ofertas/atualizar/${editingOfertaId}`, {
          ...novaOferta,
          desconto: parseFloat(String(novaOferta.desconto)),
          data_inicio: novaOferta.data_inicio || undefined,
          data_fim: novaOferta.data_fim || undefined,
        });
        setMensagem("Oferta atualizada com sucesso!");
      } else {
        await conn.post("/ofertas/cadastrar", {
          ...novaOferta,
          desconto: parseFloat(String(novaOferta.desconto)),
          data_inicio: novaOferta.data_inicio || undefined,
          data_fim: novaOferta.data_fim || undefined,
        });
        setMensagem("Oferta cadastrada com sucesso!");
      }
      setAlertVariant("success");
      setShowPanel(false);
      setNovaOferta({
        titulo: "",
        descricao: "",
        desconto: "",
        data_inicio: "",
        data_fim: "",
        produto_id: null,
        produtos_ids: [],
      });
      fetchOfertas();
    } catch {
      setMensagem("Erro ao salvar oferta.");
      setAlertVariant("danger");
    }
  };

  return (
    <div className="container mt-4 position-relative">
      <Button variant="primary" onClick={abrirCadastro}>
        Cadastrar Nova Oferta
      </Button>

      {mensagem && (
        <Alert
          variant={alertVariant}
          className="mt-3"
          onClose={() => setMensagem(null)}
          dismissible
        >
          {mensagem}
        </Alert>
      )}

      {loading ? (
        <Spinner animation="border" className="mt-4" />
      ) : error ? (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descrição</th>
              <th>Desconto (%)</th>
              <th>Produto Principal</th>
              <th>Data Início</th>
              <th>Data Fim</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ofertas.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  Nenhuma oferta encontrada.
                </td>
              </tr>
            )}
            {ofertas.map((oferta) => (
              <tr key={oferta.id}>
                <td>{oferta.titulo}</td>
                <td>{oferta.descricao || "-"}</td>
                <td>{Number(oferta.desconto).toFixed(2)}</td>
                <td>{oferta.produto_id}</td>
                <td>{oferta.data_inicio ? oferta.data_inicio.split("T")[0] : "-"}</td>
                <td>{oferta.data_fim ? oferta.data_fim.split("T")[0] : "-"}</td>
                <td>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => abrirEdicao(oferta)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" className="me-2" onClick={() => excluirOferta(oferta.id)}>
                    Excluir
                  </Button>
                  <Button size="sm" variant="info" onClick={() => abrirAssociar(oferta)}>
                    Associar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Painel lateral direito para cadastro/edição */}
      <div className={`side-panel ${showPanel ? "open" : ""}`}>
        <div className="side-panel-header d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
          <h5>{isEditMode ? "Editar Oferta" : "Cadastrar Nova Oferta"}</h5>
          <Button variant="secondary" size="sm" onClick={() => setShowPanel(false)}>
            Fechar
          </Button>
        </div>

        <Form
          className="side-panel-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Form.Group controlId="titulo" className="mb-3">
            <Form.Label>Título *</Form.Label>
            <Form.Control
              type="text"
              name="titulo"
              value={novaOferta.titulo}
              onChange={handleChange}
              placeholder="Título da oferta"
              required
            />
          </Form.Group>

          <Form.Group controlId="descricao" className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descricao"
              value={novaOferta.descricao}
              onChange={handleChange}
              placeholder="Descrição da oferta (opcional)"
            />
          </Form.Group>

          <Form.Group controlId="desconto" className="mb-3">
            <Form.Label>Desconto (%) *</Form.Label>
            <Form.Control
              type="text"
              name="desconto"
              value={novaOferta.desconto}
              onChange={handleChange}
              placeholder="Ex: 15.5"
              required
            />
          </Form.Group>

          <Form.Group controlId="data_inicio" className="mb-3">
            <Form.Label>Data de Início</Form.Label>
            <Form.Control
              type="date"
              name="data_inicio"
              value={novaOferta.data_inicio}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="data_fim" className="mb-3">
            <Form.Label>Data de Fim</Form.Label>
            <Form.Control
              type="date"
              name="data_fim"
              value={novaOferta.data_fim}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="produtos_ids" className="mb-3">
            <Form.Label>Produtos da Oferta *</Form.Label>
            <Form.Select
              multiple
              name="produtos_ids"
              value={novaOferta.produtos_ids.map(String)}
              onChange={handleMultiProdutoChange}
            >
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Segure Ctrl (ou Cmd) para selecionar múltiplos produtos.
            </Form.Text>
          </Form.Group>

          {novaOferta.produtos_ids.length > 0 && (
            <Form.Group controlId="produto_id" className="mb-3">
              <Form.Label>Produto Principal *</Form.Label>
              {novaOferta.produtos_ids.map((produtoId) => {
                const produto = produtos.find((p) => p.id === produtoId);
                return (
                  <Form.Check
                    key={produtoId}
                    type="radio"
                    label={produto?.nome || `ID ${produtoId}`}
                    name="produto_principal"
                    value={produtoId}
                    checked={novaOferta.produto_id === produtoId}
                    onChange={(e) =>
                      setNovaOferta((prev) => ({
                        ...prev,
                        produto_id: parseInt(e.target.value, 10),
                      }))
                    }
                  />
                );
              })}
            </Form.Group>
          )}

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              {isEditMode ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </Form>
      </div>

      {/* Modal para associar produtos */}
      <Modal show={showAssociarModal} onHide={() => setShowAssociarModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Associar Produtos à Oferta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="produtos_associar">
            <Form.Label>Produtos</Form.Label>
            <Form.Select
              multiple
              value={produtosSelecionados.map(String)}
              onChange={handleAssociarProdutosChange}
            >
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Segure Ctrl (ou Cmd) para selecionar múltiplos produtos.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssociarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={salvarAssociarProdutos}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Estilos do painel lateral */}
      <style jsx>{`
        .side-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          max-width: 90vw;
          height: 100vh;
          background-color: white;
          box-shadow: -4px 0 8px rgba(0,0,0,0.2);
          padding: 1.5rem;
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
          z-index: 1050;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .side-panel.open {
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
}
