'use client';

import { useState } from "react";
import { Button, Form, Alert, Spinner, Card } from "react-bootstrap";
import { BiCategoryAlt, BiErrorCircle, BiX } from "react-icons/bi";
import { useCategorias } from "@/service/Hooks/Categorias";
import { cadastrarCategoria } from "@/service/Hooks/cathooks";

interface AxiosErrorLike {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function Categorias() {
  const { categorias, loading, error, refetch } = useCategorias(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const abrirDrawer = () => setDrawerOpen(true);
  const fecharDrawer = () => {
    setDrawerOpen(false);
    setNome("");
    setDescricao("");
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      setFormError("O nome é obrigatório.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const novaCategoria = await cadastrarCategoria({ nome, descricao });
      if (novaCategoria && novaCategoria.id) {
        refetch();
        fecharDrawer();
      } else {
        setFormError("Erro ao cadastrar categoria.");
      }
    } catch (err: unknown) {
      console.error(err);
      let mensagem = "Erro ao cadastrar categoria.";

      if (typeof err === "object" && err !== null) {
        const axiosError = err as AxiosErrorLike;
        if (axiosError.response?.data?.error) {
          mensagem = axiosError.response.data.error;
        } else if (err instanceof Error) {
          mensagem = err.message;
        }
      } else if (err instanceof Error) {
        mensagem = err.message;
      }

      setFormError(mensagem);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="container-categorias p-4 mx-auto">
        <header className="header-categorias d-flex align-items-center gap-3 mb-4">
          <BiCategoryAlt size={36} className="icon-primary" />
          <h1 className="titulo-principal">Categorias</h1>
        </header>

        <div className="mb-4 d-flex justify-content-start">
          <Button
            variant="primary"
            onClick={abrirDrawer}
            className="btn-nova-categoria d-flex align-items-center gap-2 shadow"
          >
            <BiCategoryAlt size={20} />
            Nova Categoria
          </Button>
        </div>

        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {error && (
          <Alert variant="danger" className="d-flex align-items-center gap-2 shadow-sm">
            <BiErrorCircle size={24} />
            <span>{error}</span>
          </Alert>
        )}

        {!loading && categorias.length === 0 && (
          <p className="text-muted fst-italic text-center my-5">Nenhuma categoria cadastrada.</p>
        )}

        {!loading && categorias.length > 0 && (
          <Card className="card-tabela shadow-sm rounded-4">
            <div className="table-responsive">
              <table className="table tabela-estilizada table-hover align-middle mb-0">
                <thead className="table-head-primary sticky-top">
                  <tr>
                    <th className="text-center" style={{ width: 60 }}>#ID</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((categoria, idx) => (
                    <tr key={categoria.id} className={idx % 2 === 0 ? "linha-par" : "linha-impar"}>
                      <td className="text-center text-muted fw-semibold">{categoria.id}</td>
                      <td className="fw-semibold text-primary">{categoria.nome}</td>
                      <td className="text-truncate" style={{ maxWidth: 360 }}>
                        {categoria.descricao || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Drawer lateral */}
      <div
        className={`drawer ${drawerOpen ? "open" : ""}`}
        aria-hidden={!drawerOpen}
        role="dialog"
        aria-modal="true"
      >
        <div className="drawer-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <BiCategoryAlt size={24} />
            Cadastrar Categoria
          </h5>
          <Button variant="link" onClick={fecharDrawer} aria-label="Fechar painel" className="text-dark fs-4 p-0">
            <BiX />
          </Button>
        </div>

        <div className="drawer-body p-3 overflow-auto">
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formNomeCategoria">
              <Form.Label className="fw-semibold">
                Nome <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome da categoria"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoFocus
                disabled={submitting}
                isInvalid={!!formError && !nome.trim()}
                className="input-focus-animated"
              />
              <Form.Control.Feedback type="invalid">O nome é obrigatório.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formDescricaoCategoria">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Descrição opcional"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={submitting}
                className="input-focus-animated"
              />
            </Form.Group>

            {formError && (
              <Alert variant="danger" className="d-flex align-items-center gap-2 mb-4">
                <BiErrorCircle size={20} />
                <span>{formError}</span>
              </Alert>
            )}

            <div className="d-flex justify-content-end gap-3">
              <Button
                variant="outline-secondary"
                onClick={fecharDrawer}
                disabled={submitting}
                className="btn-cancelar"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="btn-salvar d-flex align-items-center gap-2"
              >
                {submitting && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                {submitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <style jsx>{`
        /* Container e tabela */
        .container-categorias {
          max-width: 900px;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.07);
        }
        .header-categorias {
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 12px;
        }
        .icon-primary {
          color: #0d6efd;
        }
        .titulo-principal {
          font-weight: 700;
          font-size: 2rem;
          color: #0d6efd;
          margin: 0;
        }
        .btn-nova-categoria {
          background: linear-gradient(45deg, #0d6efd, #6610f2);
          border: none;
          font-weight: 600;
          font-size: 1.05rem;
          transition: background 0.3s ease;
        }
        .btn-nova-categoria:hover {
          background: linear-gradient(45deg, #6610f2, #0d6efd);
        }
        .card-tabela {
          border: none;
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        .table-responsive {
          max-height: 460px;
          overflow-y: auto;
        }
        .tabela-estilizada thead.table-head-primary {
          background-color: #0d6efd;
          color: #fff;
          position: sticky;
          top: 0;
          z-index: 10;
          font-weight: 700;
          font-size: 1rem;
        }
        .tabela-estilizada tbody tr.linha-par {
          background-color: #f9faff;
          transition: background-color 0.2s ease;
        }
        .tabela-estilizada tbody tr.linha-impar {
          background-color: #ffffff;
          transition: background-color 0.2s ease;
        }
        .tabela-estilizada tbody tr:hover {
          background-color: #d9e7ff !important;
          cursor: pointer;
        }

        /* Drawer lateral */
        .drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 420px;
          height: 100vh;
          background: #fff;
          box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          z-index: 1050;
          overflow: hidden;
        }
        .drawer.open {
          transform: translateX(0);
        }
        .drawer-header {
          flex-shrink: 0;
          border-bottom: 1px solid #ddd;
        }
        .drawer-body {
          flex-grow: 1;
          overflow-y: auto;
          padding: 1rem 1.5rem;
        }

        /* Input focus */
        .input-focus-animated:focus {
          border-color: #6610f2 !important;
          box-shadow: 0 0 6px 2px rgba(102, 16, 242, 0.4);
          transition: all 0.3s ease;
        }

        /* Botões */
        .btn-cancelar {
          font-weight: 600;
          border-radius: 6px;
          padding: 0.5rem 1.5rem;
        }
        .btn-salvar {
          font-weight: 700;
          border-radius: 6px;
          padding: 0.5rem 1.8rem;
          background: linear-gradient(45deg, #6610f2, #0d6efd);
          border: none;
          transition: background 0.3s ease;
        }
        .btn-salvar:hover:not(:disabled) {
          background: linear-gradient(45deg, #0d6efd, #6610f2);
        }

        /* Responsividade */
        @media (max-width: 576px) {
          .container-categorias {
            padding: 1rem 1.5rem;
          }
          .titulo-principal {
            font-size: 1.5rem;
          }
          .btn-nova-categoria {
            font-size: 0.95rem;
          }
          .drawer {
            max-width: 100%;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
