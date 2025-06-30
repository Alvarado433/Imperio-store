'use client';

import React from 'react';

interface EnderecoEntregaProps {
  cep: string;
  setCep: (v: string) => void;
  endereco: string;
  setEndereco: (v: string) => void;
  numero: string;
  setNumero: (v: string) => void;
  complemento: string;
  setComplemento: (v: string) => void;
  bairro: string;
  setBairro: (v: string) => void;
  cidade: string;
  setCidade: (v: string) => void;
  estado: string;
  setEstado: (v: string) => void;
  mascaraCep: (v: string) => string;
  onNext: () => void;
  onBack: () => void;
}

export default function EnderecoEntrega({
  cep,
  setCep,
  endereco,
  setEndereco,
  numero,
  setNumero,
  complemento,
  setComplemento,
  bairro,
  setBairro,
  cidade,
  setCidade,
  estado,
  setEstado,
  mascaraCep,
  onNext,
  onBack,
}: EnderecoEntregaProps) {
  return (
    <fieldset>
      <legend>Endereço de Entrega</legend>

      <input
        className="form-control mb-2"
        placeholder="CEP"
        value={cep}
        onChange={(e) => setCep(mascaraCep(e.target.value))}
        maxLength={9}
        required
      />
      <input
        className="form-control mb-2"
        placeholder="Endereço"
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
        required
      />
      <div className="d-flex gap-2 mb-2">
        <input
          className="form-control"
          placeholder="Número"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
        />
        <input
          className="form-control"
          placeholder="Complemento"
          value={complemento}
          onChange={(e) => setComplemento(e.target.value)}
        />
      </div>
      <input
        className="form-control mb-2"
        placeholder="Bairro"
        value={bairro}
        onChange={(e) => setBairro(e.target.value)}
        required
      />
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          required
        />
        <input
          className="form-control"
          placeholder="UF"
          maxLength={2}
          value={estado}
          onChange={(e) => setEstado(e.target.value.toUpperCase())}
          required
        />
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" type="button" onClick={onBack}>
          Voltar
        </button>
        <button className="btn btn-primary" type="button" onClick={onNext}>
          Próximo
        </button>
      </div>
    </fieldset>
  );
}
