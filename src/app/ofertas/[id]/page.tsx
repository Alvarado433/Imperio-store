'use client';

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import conn from "@/service/Conexao/conn";
import Image from "next/image";
import {
  FaTruck,
  FaTags,
  FaCreditCard,
  FaTimesCircle,
} from "react-icons/fa";
import ImperioStore from "@/components/Imperio/Inicio/Navbar";
import Footer from "@/components/Imperio/Footer/Rodape";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque?: string; 
  parcelamento?: string;
  pix_valor?: number;
  formas_pagamento: string[];
  imagens: {
    id: number;
    imagem_base64?: string;
    miniatura_base64?: string;
  }[];
}

interface Oferta {
  id: number;
  titulo: string;
}

export default function ProdutosOfertaPage() {
  const pathname = usePathname();
  const router = useRouter();

  // Tipando explicitamente id como string | undefined
  const id: string | undefined = pathname?.split("/").pop();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [oferta, setOferta] = useState<Oferta | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroPrecoMin, setFiltroPrecoMin] = useState("");
  const [filtroPrecoMax, setFiltroPrecoMax] = useState("");
  const [filtroEstoque, setFiltroEstoque] = useState<"todos" | "em-estoque" | "esgotado">("todos");

  const [debouncedNome, setDebouncedNome] = useState(filtroNome);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedNome(filtroNome), 400);
    return () => clearTimeout(handler);
  }, [filtroNome]);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    Promise.all([
      conn.get<Oferta>(`/ofertas/${id}`),
      conn.get<Produto[]>(`/ofertas/${id}/produtos`),
    ])
      .then(([ofertaRes, produtosRes]) => {
        setOferta(ofertaRes.data);
        setProdutos(produtosRes.data);
        setError(null);
      })
      .catch(() => {
        setError("Erro ao carregar dados da oferta ou produtos.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    let filtrados = [...produtos];

    if (debouncedNome.trim() !== "") {
      filtrados = filtrados.filter((p) =>
        p.nome.toLowerCase().includes(debouncedNome.toLowerCase())
      );
    }

    if (filtroPrecoMin.trim() !== "") {
      const min = parseFloat(filtroPrecoMin);
      if (!isNaN(min)) {
        filtrados = filtrados.filter((p) => p.preco >= min);
      }
    }

    if (filtroPrecoMax.trim() !== "") {
      const max = parseFloat(filtroPrecoMax);
      if (!isNaN(max)) {
        filtrados = filtrados.filter((p) => p.preco <= max);
      }
    }

    if (filtroEstoque === "em-estoque") {
      filtrados = filtrados.filter((p) => parseInt(p.estoque ?? "0", 10) > 0);
    } else if (filtroEstoque === "esgotado") {
      filtrados = filtrados.filter((p) => parseInt(p.estoque ?? "0", 10) === 0);
    }

    setProdutosFiltrados(filtrados);
    setVisibleCount(6);
  }, [debouncedNome, filtroPrecoMin, filtroPrecoMax, filtroEstoque, produtos]);

  const limparFiltros = () => {
    setFiltroNome("");
    setFiltroPrecoMin("");
    setFiltroPrecoMax("");
    setFiltroEstoque("todos");
  };

  const irParaProduto = (produtoId: number) => {
    router.push(`/produtos/${produtoId}`);
  };

  const mostrarMais = () => {
    setVisibleCount((v) => v + 6);
  };

  return (
    <>
      <ImperioStore />
      <div className="container mt-4 mb-5">
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb bg-light px-3 py-2 rounded">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none">Início</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/ofertas" className="text-decoration-none">Ofertas</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {oferta ? oferta.titulo : "Carregando..."}
            </li>
          </ol>
        </nav>

        <h2 className="mb-4 text-center text-md-start text-secondary">Produtos</h2>

        <div className="row">
          <aside className="col-12 col-md-4 col-lg-3 mb-4" style={{ minWidth: "250px" }}>
            <div className="p-4 shadow rounded bg-white sticky-top" style={{ top: "80px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-muted">Filtros</h5>
                <button className="btn btn-sm btn-outline-danger" onClick={limparFiltros}>
                  <FaTimesCircle />
                </button>
              </div>

              <div className="mb-3">
                <label htmlFor="filtroNome" className="form-label fw-semibold">Buscar por Nome</label>
                <input
                  type="text"
                  id="filtroNome"
                  className="form-control"
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  placeholder="Nome do produto"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="precoMin">Preço Mínimo (R$)</label>
                <input
                  type="number"
                  id="precoMin"
                  className="form-control"
                  min="0"
                  value={filtroPrecoMin}
                  onChange={(e) => setFiltroPrecoMin(e.target.value)}
                  placeholder="Ex: 50"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="precoMax">Preço Máximo (R$)</label>
                <input
                  type="number"
                  id="precoMax"
                  className="form-control"
                  min="0"
                  value={filtroPrecoMax}
                  onChange={(e) => setFiltroPrecoMax(e.target.value)}
                  placeholder="Ex: 1000"
                />
              </div>

              <fieldset className="mb-0">
                <legend className="fw-semibold mb-2">Disponibilidade</legend>

                {["todos", "em-estoque", "esgotado"].map((opcao) => (
                  <div className="form-check" key={opcao}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="estoque"
                      id={`estoque-${opcao}`}
                      checked={filtroEstoque === opcao}
                      onChange={() => setFiltroEstoque(opcao as "todos" | "em-estoque" | "esgotado")}
                    />
                    <label className="form-check-label" htmlFor={`estoque-${opcao}`} style={{ userSelect: "none" }}>
                      {opcao === "todos" ? "Todos" : opcao === "em-estoque" ? "Em estoque" : "Esgotados"}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>
          </aside>

          <section className="col-12 col-md-8 col-lg-9">
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status"></div>
                <p className="mt-3">Carregando produtos...</p>
              </div>
            )}

            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}

            {!loading && !error && produtosFiltrados.length === 0 && (
              <div className="alert alert-info text-center" role="alert">
                Nenhum produto encontrado com os filtros aplicados.
              </div>
            )}

            {!loading && !error && produtosFiltrados.length > 0 && (
              <>
                <div className="row g-4">
                  {produtosFiltrados.slice(0, visibleCount).map((produto) => {
                    const imagem = produto.imagens[0];
                    const imgSrc = imagem?.miniatura_base64
                      ? `data:image/png;base64,${imagem.miniatura_base64}`
                      : imagem?.imagem_base64
                      ? `data:image/png;base64,${imagem.imagem_base64}`
                      : "/img/Logotipo.png";

                    return (
                      <div key={produto.id} className="col-12 col-sm-6 col-md-6 col-lg-4">
                        <div
                          className="card h-100 shadow produto-card border-0"
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#B56576",
                            color: "white",
                            borderRadius: "0.75rem",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          }}
                          onClick={() => irParaProduto(produto.id)}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            el.style.transform = "scale(1.05)";
                            el.style.boxShadow = "0 8px 20px rgba(181, 101, 118, 0.7)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            el.style.transform = "scale(1)";
                            el.style.boxShadow = "none";
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") irParaProduto(produto.id);
                          }}
                        >
                          <Image
                            src={imgSrc}
                            alt={produto.nome}
                            width={300}
                            height={200}
                            className="card-img-top rounded-top"
                            style={{ objectFit: "cover", height: "200px" }}
                          />
                          <div className="card-body">
                            <h5 className="card-title text-truncate">{produto.nome}</h5>
                            <p className="card-text fw-bold fs-5">R$ {produto.preco.toFixed(2)}</p>

                            {produto.pix_valor && (
                              <p className="card-text text-warning small mb-1">
                                <FaTags className="me-1" /> No Pix: R$ {produto.pix_valor.toFixed(2)}
                              </p>
                            )}

                            {produto.parcelamento && (
                              <p className="card-text small mb-1" style={{ color: "#b56576" }}>
                                <FaCreditCard className="me-1" /> até {produto.parcelamento}x sem juros no cartão
                              </p>
                            )}

                            {produto.formas_pagamento.length > 0 && (
                              <p className="card-text small text-light">
                                <FaTruck className="me-1" /> {produto.formas_pagamento.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {visibleCount < produtosFiltrados.length && (
                  <div className="text-center mt-4">
                    <button className="btn btn-outline-danger" onClick={mostrarMais}>
                      Ver mais produtos
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
