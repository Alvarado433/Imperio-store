'use client';

import React from 'react';

interface ClienteDadosProps {
  nomeCompleto: string;
  setNomeCompleto: (v: string) => void;
  cpf: string;
  setCpf: (v: string) => void;
  telefone: string;
  setTelefone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  mascaraCpf: (v: string) => string;
  mascaraTelefone: (v: string) => string;
  onNext: () => void;
}

export default function ClienteDados({
  nomeCompleto,
  setNomeCompleto,
  cpf,
  setCpf,
  telefone,
  setTelefone,
  email,
  setEmail,
  mascaraCpf,
  mascaraTelefone,
  onNext,
}: ClienteDadosProps) {
  return (
    <fieldset>
      <legend>Dados do Cliente</legend>

      <input
        className="form-control mb-2"
        placeholder="Nome Completo"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
        required
      />
      <input
        className="form-control mb-2"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(mascaraCpf(e.target.value))}
        maxLength={14}
        required
      />
      <input
        className="form-control mb-2"
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
        maxLength={15}
        required
      />
      <input
        className="form-control mb-3"
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button className="btn btn-primary" type="button" onClick={onNext}>
        Próximo
      </button>
    </fieldset>
  );
}
