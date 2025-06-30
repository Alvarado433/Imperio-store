"use client";

import React, { useState } from "react";
import conn from "@/service/Conexao/conn";
import { Nivel, useNiveis } from "@/service/Hooks/useNiveis";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

export default function CadastrarCupom() {
  const { niveis, loading: carregandoNiveis, error: erroNiveis } = useNiveis();

  const [codigo, setCodigo] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [desconto, setDesconto] = useState<number | "">("");
  const [freteGratis, setFreteGratis] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [statusId, setStatusId] = useState<number | null>(null);
  const [validade, setValidade] = useState<string>("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!codigo.trim() || !minPrice || statusId === null) {
      return MySwal.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "Código, preço mínimo e status são obrigatórios.",
      });
    }

    setLoading(true);
    try {
      const payload = {
        codigo: codigo.trim(),
        minPrice: Number(minPrice),
        maxPrice: maxPrice === "" ? null : Number(maxPrice),
        discount: desconto === "" ? null : Number(desconto),
        freeShipping: freteGratis,
        label: descricao.trim(),
        statusId,
        validade: validade || null,
      };

      const res = await conn.post("/cupons/cadastrar", payload);

      if (res.status === 201 || res.status === 200) {
        await MySwal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Cupom cadastrado com sucesso!",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        // Reset form
        setCodigo("");
        setMinPrice("");
        setMaxPrice("");
        setDesconto("");
        setFreteGratis(false);
        setDescricao("");
        setStatusId(null);
        setValidade("");
      } else {
        throw new Error("Erro ao cadastrar cupom.");
      }
    } catch (err: unknown) {
      let mensagem = "Erro na requisição.";

      if (axios.isAxiosError(err)) {
        mensagem = err.response?.data?.erro ?? mensagem;
      } else if (err instanceof Error) {
        mensagem = err.message;
      }

      await MySwal.fire({
        icon: "error",
        title: "Erro",
        text: mensagem,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container" role="main" aria-labelledby="titulo-formulario">
        <h2 id="titulo-formulario">Cadastrar Cupom</h2>

        {carregandoNiveis && <p className="info">Carregando níveis...</p>}
        {erroNiveis && <p className="error">{erroNiveis}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="field half-width">
              <label htmlFor="codigo">Código *</label>
              <input
                id="codigo"
                name="codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                required
                placeholder="Ex: DESCONTO10"
                autoComplete="off"
                disabled={loading}
                aria-required="true"
              />
            </div>

            <div className="field half-width">
              <label htmlFor="statusId">Status *</label>
              <select
                id="statusId"
                name="statusId"
                value={statusId ?? ""}
                onChange={(e) => setStatusId(Number(e.target.value))}
                required
                disabled={loading}
                aria-required="true"
              >
                <option value="" disabled>
                  Selecione um status
                </option>
                {niveis.map((nivel: Nivel) => (
                  <option key={nivel.id} value={nivel.id}>
                    {nivel.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="field half-width">
              <label htmlFor="minPrice">Preço Mínimo *</label>
              <input
                id="minPrice"
                name="minPrice"
                type="number"
                step="0.01"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value === "" ? "" : Number(e.target.value))
                }
                required
                min="0"
                disabled={loading}
                aria-required="true"
              />
            </div>

            <div className="field half-width">
              <label htmlFor="maxPrice">Preço Máximo</label>
              <input
                id="maxPrice"
                name="maxPrice"
                type="number"
                step="0.01"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
                }
                min="0"
                disabled={loading}
              />
            </div>
          </div>

          <div className="row">
            <div className="field half-width">
              <label htmlFor="desconto">Desconto (%)</label>
              <input
                id="desconto"
                name="desconto"
                type="number"
                step="0.01"
                value={desconto}
                onChange={(e) =>
                  setDesconto(e.target.value === "" ? "" : Number(e.target.value))
                }
                min="0"
                max="100"
                placeholder="0 a 100"
                disabled={loading}
              />
            </div>

            <div className="field half-width checkbox-field">
              <label htmlFor="freteGratis" className="checkbox-label">
                <input
                  id="freteGratis"
                  name="freteGratis"
                  type="checkbox"
                  checked={freteGratis}
                  onChange={() => setFreteGratis(!freteGratis)}
                  disabled={loading}
                />
                Frete Grátis
              </label>
            </div>
          </div>

          <div className="field full-width">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={255}
              placeholder="Descrição do cupom (opcional)"
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="field half-width">
            <label htmlFor="validade">Validade</label>
            <input
              id="validade"
              name="validade"
              type="date"
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} aria-busy={loading}>
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true"></span> Salvando...
              </>
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .container {
          max-width: 520px;
          margin: 3rem auto;
          padding: 2rem 2rem 2.5rem;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #2c3e50;
          user-select: none;
        }

        h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-weight: 700;
          font-size: 2rem;
          color: #34495e;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .field {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .full-width {
          flex: 1 1 100%;
        }

        .half-width {
          flex: 1 1 calc(50% - 0.5rem);
          min-width: 190px;
        }

        label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #34495e;
          user-select: text;
        }

        input[type="text"],
        input[type="number"],
        input[type="date"],
        select,
        textarea {
          width: 100%;
          padding: 0.6rem 1rem;
          border: 1.6px solid #bdc3c7;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          font-family: inherit;
          color: #2c3e50;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          box-sizing: border-box;
          user-select: text;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        input[type="date"]:focus,
        select:focus,
        textarea:focus {
          border-color: #2980b9;
          box-shadow: 0 0 8px #85c1e9;
          outline: none;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
          line-height: 1.4;
        }

        .checkbox-field {
          flex: 1 1 calc(50% - 0.5rem);
          margin-top: 2rem;
          user-select: text;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 600;
          color: #34495e;
          gap: 0.5rem;
          user-select: text;
          font-size: 1rem;
        }

        .checkbox-label input[type="checkbox"] {
          width: 22px;
          height: 22px;
          cursor: pointer;
          accent-color: #2980b9;
          margin: 0;
          border-radius: 4px;
          border: 1.5px solid #bdc3c7;
          transition: border-color 0.3s ease;
        }

        .checkbox-label input[type="checkbox"]:focus {
          border-color: #2980b9;
          outline: none;
        }

        button[type="submit"] {
          margin-top: 2.5rem;
          padding: 0.85rem;
          width: 100%;
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          background-color: #2980b9;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          user-select: none;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.7rem;
        }

        button[type="submit"]:hover:not(:disabled) {
          background-color: #1c5980;
        }

        button[type="submit"]:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.4);
          border-top: 3px solid #fff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsividade */
        @media (max-width: 600px) {
          .row {
            flex-direction: column;
          }

          .half-width,
          .checkbox-field {
            flex: 1 1 100%;
            margin-top: 0 !important;
          }

          button[type="submit"] {
            font-size: 1.1rem;
          }
        }

        /* Mensagens info e error */
        .info {
          color: #2980b9;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }

        .error {
          color: #e74c3c;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }
      `}</style>
    </>
  );
}
