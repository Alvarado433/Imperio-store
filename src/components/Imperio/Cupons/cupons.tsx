"use client";

import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import conn from "@/service/Conexao/conn";

type Cupom = {
  codigo: string;
  label: string;
  descricao?: string; // aqui
  discount?: number;
  freeShipping?: boolean;
  minPrice: number;
  validade?: string;
  statusId: number; // 3 = ativo, 4 = inativo
};

export default function Cupons() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCupons() {
      setLoading(true);
      try {
        const res = await conn.get("/cupons/listar");
        setCupons(res.data);
      } catch (error) {
        console.error("Erro ao carregar cupons:", error);
        toast.error("Erro ao carregar cupons. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }
    fetchCupons();
  }, []);

  // Filtra só cupons ativos (statusId === 3)
  const cuponsAtivos = cupons.filter((c) => c.statusId === 3);

  useEffect(() => {
    if (!loading) {
      const items = document.querySelectorAll(".item-cupom");
      items.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("aparecer");
        }, index * 150);
      });
    }
  }, [loading]);

  function copiarCupom(codigo: string) {
    navigator.clipboard.writeText(codigo);
    toast.success(`Cupom ${codigo} copiado! Use no checkout.`);
  }

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "3rem", fontSize: "1.1rem" }}>
        Carregando cupons...
      </p>
    );

  if (cuponsAtivos.length === 0)
    return (
      <p style={{ textAlign: "center", marginTop: "3rem", fontSize: "1.1rem" }}>
        Nenhum cupom ativo disponível no momento.
      </p>
    );

  return (
    <section className="cupons-area" aria-label="Cupons disponíveis para desconto">
      <h2>💖 Cupons Exclusivos</h2>
      <p className="subtitulo">
        Aproveite e garanta seus descontos antes que acabem!
      </p>

      <ul className="lista-cupons">
        {cuponsAtivos.map((cupom) => (
          <li key={cupom.codigo} className="item-cupom" tabIndex={0}>
            <div className="info-cupom">
              <span className="label">{cupom.label || cupom.descricao}</span>
              <div className="detalhes-wrapper">
                {cupom.discount && (
                  <span className="detalhe">Desconto: {cupom.discount}%</span>
                )}
                {cupom.freeShipping && (
                  <span className="detalhe destaque-frete">Frete Grátis</span>
                )}
                <span className="detalhe">
                  Pedido mínimo: R$ {cupom.minPrice.toFixed(2)}
                </span>
                {cupom.validade && (
                  <span className="detalhe">
                    Válido até {new Date(cupom.validade).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="codigo-box">
              <span className="codigo" aria-label={`Código do cupom ${cupom.codigo}`}>
                {cupom.codigo}
              </span>
              <button
                aria-label={`Copiar código do cupom ${cupom.codigo}`}
                onClick={() => copiarCupom(cupom.codigo)}
                className="btn-copiar"
              >
                <FaCopy />
                <span className="btn-text">Copiar</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <style jsx>{`
        .cupons-area {
          padding: 3rem 1rem;
          background: linear-gradient(135deg, #fff0f5 0%, #ffe4ed 100%);
          text-align: center;
          margin: 3rem 0;
          user-select: none;
        }
        h2 {
          color: #b6426e;
          font-size: 2.4rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          letter-spacing: 1px;
        }
        .subtitulo {
          color: #6d3e57;
          margin-bottom: 2.5rem;
          font-size: 1.2rem;
          font-weight: 500;
        }
        .lista-cupons {
          list-style: none;
          padding: 0;
          margin: 0 auto;
          max-width: 960px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.7rem;
        }
        .item-cupom {
          border: 2px dashed #f5bfd0;
          padding: 1.3rem 1.5rem;
          background: #fff;
          border-radius: 14px;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 12px 22px rgba(182, 66, 110, 0.1);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          outline-offset: 3px;
          cursor: default;
        }
        .item-cupom.aparecer {
          opacity: 1;
          transform: translateY(0);
        }
        .item-cupom:hover,
        .item-cupom:focus-visible {
          background: #ffe9f0;
          transform: translateY(-4px);
          box-shadow: 0 18px 30px rgba(182, 66, 110, 0.25);
        }
        .info-cupom {
          margin-bottom: 1.3rem;
        }
        .label {
          display: block;
          font-weight: 800;
          color: #b6426e;
          font-size: 1.4rem;
          margin-bottom: 0.6rem;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .detalhes-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }
        .detalhe {
          background: #fce9f0;
          color: #8e4962;
          padding: 0.35rem 0.75rem;
          font-size: 0.95rem;
          border-radius: 20px;
          font-weight: 600;
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.04);
          user-select: text;
        }
        .destaque-frete {
          background: #b6426e;
          color: #fff;
          font-weight: 700;
          box-shadow: 0 0 8px rgba(182, 66, 110, 0.8);
        }
        .codigo-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffe3ec;
          padding: 0.6rem 1rem;
          border-radius: 10px;
          box-shadow: inset 0 0 6px rgba(182, 66, 110, 0.15);
        }
        .codigo {
          font-weight: 900;
          color: #b6426e;
          font-size: 1.3rem;
          letter-spacing: 2px;
          background: #fff;
          padding: 0.4rem 0.9rem;
          border-radius: 8px;
          border: 2px solid #f5bfd0;
          user-select: all;
        }
        .btn-copiar {
          background: #b6426e;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 9px rgba(182, 66, 110, 0.6);
          transition: background 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
        }
        .btn-copiar:hover,
        .btn-copiar:focus-visible {
          background: #922950;
          box-shadow: 0 6px 14px rgba(146, 41, 80, 0.9);
          outline: none;
        }

        @media (max-width: 480px) {
          .lista-cupons {
            grid-template-columns: 1fr;
          }
          .codigo-box {
            flex-direction: column;
            gap: 0.7rem;
          }
          .btn-copiar {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
