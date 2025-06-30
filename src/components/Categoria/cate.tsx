"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/service/Conexao/conn"; // Sua instância axios configurada
import Navbar from "../Imperio/Inicio/Navbar";
import Footer from "../Imperio/Footer/Rodape";

interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

interface Imagem {
  id: number;
  imagem_base64: string;
  descricao?: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: Categoria;
  imagens: Imagem[];
}

interface Oferta {
  id: number;
  titulo: string;
}

interface CategoriaClientProps {
  categoria: string;
}

export default function CategoriaClient({ categoria }: CategoriaClientProps) {
  const [produtosCompleto, setProdutosCompleto] = useState<Produto[]>([]);
  const [produtosVisiveis, setProdutosVisiveis] = useState<Produto[]>([]);
  const [categoriaData, setCategoriaData] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const porPagina = 6;

  const [ofertasFiltro, setOfertasFiltro] = useState<Oferta[]>([]);
  const [ofertaSelecionada, setOfertaSelecionada] = useState<number | null>(null);

  const [precoMin, setPrecoMin] = useState<number | "">("");
  const [precoMax, setPrecoMax] = useState<number | "">("");
  const [buscaNome, setBuscaNome] = useState<string>("");

  const carregarProdutos = async (categoriaNome: string, ofertaId: number | null) => {
    setLoading(true);
    setError(null);
    setPagina(1);
    try {
      if (ofertaId === null) {
        const res = await api.get<{ categoria: Categoria; produtos: Produto[] }>(
          `/categorias/listrar/nome/${encodeURIComponent(categoriaNome)}`
        );
        setCategoriaData(res.data.categoria);
        setProdutosCompleto(res.data.produtos);
      } else {
        const res = await api.get<{ produtos: Produto[] }>(
          `/ofertas/listrar/produtos/oferta/${ofertaId}/categoria/${encodeURIComponent(categoriaNome)}`
        );
        setCategoriaData({ id: 0, nome: categoriaNome });
        setProdutosCompleto(res.data.produtos);
      }
    } catch {
      setError("Erro ao carregar produtos ou categoria.");
      setProdutosCompleto([]);
      setCategoriaData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchOfertas() {
      try {
        const res = await api.get<Oferta[]>("/ofertas/listrar");
        setOfertasFiltro(res.data);
      } catch {
        setOfertasFiltro([]);
      }
    }
    fetchOfertas();
  }, []);

  useEffect(() => {
    carregarProdutos(categoria, ofertaSelecionada);
  }, [categoria, ofertaSelecionada]);

  useEffect(() => {
    let filtrados = [...produtosCompleto];
    if (buscaNome.trim()) {
      filtrados = filtrados.filter((p) =>
        p.nome.toLowerCase().includes(buscaNome.toLowerCase())
      );
    }
    if (precoMin !== "" && !isNaN(Number(precoMin))) {
      filtrados = filtrados.filter((p) => p.preco >= Number(precoMin));
    }
    if (precoMax !== "" && !isNaN(Number(precoMax))) {
      filtrados = filtrados.filter((p) => p.preco <= Number(precoMax));
    }
    setProdutosVisiveis(filtrados.slice(0, porPagina));
    setPagina(1);
  }, [buscaNome, precoMin, precoMax, produtosCompleto]);

  const carregarMais = () => {
    const proximaPagina = pagina + 1;
    let filtrados = [...produtosCompleto];
    if (buscaNome.trim()) {
      filtrados = filtrados.filter((p) =>
        p.nome.toLowerCase().includes(buscaNome.toLowerCase())
      );
    }
    if (precoMin !== "" && !isNaN(Number(precoMin))) {
      filtrados = filtrados.filter((p) => p.preco >= Number(precoMin));
    }
    if (precoMax !== "" && !isNaN(Number(precoMax))) {
      filtrados = filtrados.filter((p) => p.preco <= Number(precoMax));
    }
    setProdutosVisiveis(filtrados.slice(0, proximaPagina * porPagina));
    setPagina(proximaPagina);
  };

  const podeCarregarMais =
    produtosVisiveis.length <
    produtosCompleto.filter((p) => {
      let cond = true;
      if (buscaNome.trim())
        cond = cond && p.nome.toLowerCase().includes(buscaNome.toLowerCase());
      if (precoMin !== "" && !isNaN(Number(precoMin)))
        cond = cond && p.preco >= Number(precoMin);
      if (precoMax !== "" && !isNaN(Number(precoMax)))
        cond = cond && p.preco <= Number(precoMax);
      return cond;
    }).length;

  if (error) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  if (loading && produtosVisiveis.length === 0) {
    return (
      <div className="container my-5 text-center">
        <div
          className="spinner-border text-warning"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        />
        <p className="mt-3 text-muted">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid my-5 px-4 px-md-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb bg-light rounded-3 px-3 py-2 shadow-sm breadcrumb-custom">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none breadcrumb-link">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link
                href="/categoria"
                className="text-decoration-none breadcrumb-link"
              >
                Categorias
              </Link>
            </li>
            <li
              className="breadcrumb-item active text-secondary"
              aria-current="page"
              style={{ fontWeight: "600" }}
            >
              {categoriaData?.nome}
            </li>
          </ol>
        </nav>

        <div className="row gx-4 gy-4">
          <aside className="col-lg-3 order-2 order-lg-1">
            <div className="filter-box rounded-4 shadow-sm p-4">
              <h5 className="filter-title">Filtrar Ofertas</h5>
              <ul className="list-unstyled mb-4">
                <li className="mb-2">
                  <button
                    className={`btn btn-sm w-100 rounded-3 ${
                      ofertaSelecionada === null
                        ? "btn-warning"
                        : "btn-outline-warning"
                    }`}
                    onClick={() => setOfertaSelecionada(null)}
                  >
                    Todas
                  </button>
                </li>
                {ofertasFiltro.map((of) => (
                  <li key={of.id} className="mb-2">
                    <button
                      className={`btn btn-sm w-100 rounded-3 ${
                        ofertaSelecionada === of.id
                          ? "btn-warning"
                          : "btn-outline-warning"
                      }`}
                      onClick={() => setOfertaSelecionada(of.id)}
                    >
                      {of.titulo}
                    </button>
                  </li>
                ))}
              </ul>

              <h5 className="filter-title">Buscar</h5>
              <input
                type="text"
                className="form-control mb-3 rounded-3 border-warning"
                placeholder="Buscar por nome"
                value={buscaNome}
                onChange={(e) => setBuscaNome(e.target.value)}
              />

              <h5 className="filter-title">Faixa de Preço</h5>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control rounded-3 border-warning"
                  placeholder="Mínimo"
                  value={precoMin}
                  onChange={(e) =>
                    setPrecoMin(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
                <input
                  type="number"
                  className="form-control rounded-3 border-warning"
                  placeholder="Máximo"
                  value={precoMax}
                  onChange={(e) =>
                    setPrecoMax(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              </div>
            </div>
          </aside>

          <main className="col-lg-9 order-1 order-lg-2">
            <h2 className="mb-4 fw-bold text-warning border-bottom pb-2">
              Produtos - {categoriaData?.nome}
            </h2>

            {produtosVisiveis.length === 0 ? (
              <p className="text-muted fst-italic">Nenhum produto encontrado.</p>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {produtosVisiveis.map((produto) => {
                  const base64Image = produto.imagens?.[0]?.imagem_base64;
                  const imgSrc = base64Image
                    ? `data:image/jpeg;base64,${base64Image}`
                    : "/img/semimagem.jpg";

                  return (
                    <div className="col" key={produto.id}>
                      <div
                        className="card produto-card h-100 border-0 shadow rounded-4 position-relative overflow-hidden"
                        tabIndex={0}
                        onFocus={(e) => {
                          e.currentTarget.style.transform = "scale(1.03)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 15px rgba(191,161,75,0.4)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.03)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 15px rgba(191,161,75,0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Link
                          href={`/produto/${produto.id}`}
                          className="text-decoration-none text-dark d-flex flex-column h-100"
                        >
                          <div
                            className="produto-imagem-container"
                            style={{ position: "relative", width: "100%", height: 200 }}
                          >
                            <Image
                              src={imgSrc}
                              alt={produto.nome}
                              fill
                              style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="card-body d-flex flex-column p-3">
                            <h6 className="card-title mb-2 fw-bold produto-nome">
                              {produto.nome}
                            </h6>
                            <p className="mb-2 text-muted small produto-categoria">
                              {produto.categoria?.nome}
                            </p>
                            <div className="mt-auto">
                              <p className="fw-bold fs-5 text-warning mb-0 produto-preco">
                                R$ {produto.preco.toFixed(2).replace(".", ",")}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {podeCarregarMais && (
              <div className="text-center mt-4">
                <button
                  className="btn btn-outline-warning rounded-pill px-4 py-2 fw-semibold"
                  onClick={carregarMais}
                >
                  Carregar mais
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
