"use client";

import React, { useState } from "react";
import {
  Table,
  Spinner,
  Alert,
  Button,
  OverlayTrigger,
  Tooltip,
  Modal,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Usuario } from "@/types/types";
import useUsuarios from "@/service/Hooks/Usuario";
import useNivel from "@/service/Hooks/Nivel";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface AxiosErrorWithResponse {
  response?: {
    data?: {
      erro?: string;
      [key: string]: unknown; // <-- substituído 'any' por 'unknown'
    };
  };
}

export default function UsuariosPage() {
  const {
    usuarios,
    loading,
    error,
    cadastrarUsuario,
    editarUsuario,
    excluirUsuario,
  } = useUsuarios();
  const { niveis, loading: loadingNiveis, error: errorNiveis } = useNivel();

  const [showModal, setShowModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] =
    useState<Usuario | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
    nivel_id: "",
  });

  const abrirModalEditar = (usuario: Usuario) => {
    setModoEdicao(true);
    setUsuarioSelecionado(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone || "",
      cpf: usuario.cpf || "",
      senha: "",
      nivel_id: usuario.nivel_id ? String(usuario.nivel_id) : "",
    });
    setShowModal(true);
  };

  const abrirModalCadastrar = () => {
    setModoEdicao(false);
    setUsuarioSelecionado(null);
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      senha: "",
      nivel_id: "",
    });
    setShowModal(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { nome, email, telefone, cpf, senha, nivel_id } = formData;

    if (!nome || !email || (!modoEdicao && !senha)) {
      await MySwal.fire({
        icon: "error",
        title: "Erro",
        text: "Preencha nome, email e senha (para cadastro).",
      });
      return;
    }

    if (!nivel_id) {
      await MySwal.fire({
        icon: "error",
        title: "Erro",
        text: "Por favor, selecione um nível.",
      });
      return;
    }

    setLoadingSubmit(true);

    try {
      if (modoEdicao) {
        if (!usuarioSelecionado) {
          throw new Error("Usuário selecionado inválido.");
        }

        const dadosAtualizados: Partial<Omit<Usuario, "id" | "nivel">> = {
          nome,
          email,
          telefone,
          cpf,
          nivel_id: parseInt(nivel_id),
        };

        if (senha) {
          dadosAtualizados.senha = senha;
        }

        const resultado = await editarUsuario(
          usuarioSelecionado.id,
          dadosAtualizados
        );

        if (resultado.sucesso) {
          await MySwal.fire({
            icon: "success",
            title: "Sucesso",
            text: `Usuário ${resultado.usuario?.nome} atualizado!`,
          });
          setShowModal(false);
        } else {
          throw new Error(resultado.mensagem || "Erro ao atualizar usuário.");
        }
      } else {
        const payload: Omit<Usuario, "id" | "nivel"> = {
          nome,
          email,
          senha,
          telefone,
          cpf,
          nivel_id: parseInt(nivel_id),
        };

        const resultado = await cadastrarUsuario(payload);

        if (resultado.sucesso) {
          await MySwal.fire({
            icon: "success",
            title: "Sucesso",
            text: `Usuário ${resultado.usuario?.nome} cadastrado!`,
          });
          setShowModal(false);
          setFormData({
            nome: "",
            email: "",
            telefone: "",
            cpf: "",
            senha: "",
            nivel_id: "",
          });
        } else {
          throw new Error(resultado.mensagem || "Erro ao cadastrar usuário.");
        }
      }
    } catch (error: unknown) {
      let mensagem = "Erro inesperado.";
      if (error instanceof Error) {
        mensagem = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const err = error as AxiosErrorWithResponse;
        mensagem = err.response?.data?.erro || mensagem;
      }
      await MySwal.fire({
        icon: "error",
        title: "Erro",
        text: mensagem,
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleExcluir = async (usuario: Usuario) => {
    const result = await MySwal.fire({
      title: `Excluir usuário ${usuario.nome}?`,
      text: "Esta ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const resultado = await excluirUsuario(usuario.id);
        if (resultado.sucesso) {
          await MySwal.fire({
            icon: "success",
            title: "Excluído",
            text: `Usuário ${usuario.nome} excluído com sucesso!`,
          });
        } else {
          throw new Error(resultado.mensagem || "Erro ao excluir usuário.");
        }
      } catch (error: unknown) {
        let mensagem = "Erro inesperado.";
        if (error instanceof Error) {
          mensagem = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const err = error as AxiosErrorWithResponse;
          mensagem = err.response?.data?.erro || mensagem;
        }
        await MySwal.fire({
          icon: "error",
          title: "Erro",
          text: mensagem,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <div className="mt-2">Carregando usuários...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-5">
        Erro ao carregar usuários: {error}
      </Alert>
    );
  }

  return (
    <section className="p-3 bg-white rounded shadow-sm mb-4">
      <h2 className="mb-4 text-primary fw-bold">👥 Lista de Usuários</h2>

      <Button variant="success" className="mb-3" onClick={abrirModalCadastrar}>
        <FaPlus /> Novo Usuário
      </Button>

      <div className="tabela-usuarios-container">
        <div className="table-responsive">
          <Table className="table-usuarios align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>CPF</th>
                <th>Nível</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                usuarios.map((u: Usuario) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nome}</td>
                    <td>{u.email}</td>
                    <td>{u.telefone || "—"}</td>
                    <td>{u.cpf || "—"}</td>
                    <td>{u.nivel?.nome || "—"}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <OverlayTrigger overlay={<Tooltip>Editar</Tooltip>}>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => abrirModalEditar(u)}
                          >
                            <FaEdit />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger overlay={<Tooltip>Excluir</Tooltip>}>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleExcluir(u)}
                          >
                            <FaTrash />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modoEdicao ? "Editar Usuário" : "Cadastrar Usuário"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="nome" className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            {!modoEdicao && (
              <Form.Group controlId="senha" className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
            <Form.Group controlId="telefone" className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="cpf" className="mb-3">
              <Form.Label>CPF</Form.Label>
              <Form.Control
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="nivel_id" className="mb-3">
              <Form.Label>Nível</Form.Label>
              {loadingNiveis ? (
                <Spinner size="sm" />
              ) : errorNiveis ? (
                <Alert variant="danger">{errorNiveis}</Alert>
              ) : (
                <Form.Select
                  name="nivel_id"
                  value={formData.nivel_id}
                  onChange={handleChange}
                >
                  <option value="">Selecione o nível</option>
                  {niveis.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nome}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? <Spinner animation="border" size="sm" /> : "Salvar"}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .tabela-usuarios-container {
          width: 100%;
          overflow-x: auto;
          border-radius: 12px;
          padding: 1rem;
          background-color: #f8f9fa;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
        }

        .table-usuarios {
          min-width: 850px;
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background-color: #ffffff;
          border-radius: 12px;
        }

        .table-usuarios thead {
          background-color: #e9ecef;
          color: #212529;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .table-usuarios tbody tr:hover {
          background-color: #f1f3f5;
        }

        .table-usuarios th,
        .table-usuarios td {
          padding: 0.75rem;
          vertical-align: middle;
          word-break: break-word;
          text-align: left;
        }

        .table-usuarios td.text-center {
          text-align: center;
        }

        .table-responsive {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: #dee2e6 transparent;
        }

        .table-responsive::-webkit-scrollbar {
          height: 6px;
        }

        .table-responsive::-webkit-scrollbar-thumb {
          background-color: #adb5bd;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
