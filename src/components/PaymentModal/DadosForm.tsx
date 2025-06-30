'use client';

import React from 'react';

interface DadosPessoaisProps {
  nomeCompleto: string;
  setNomeCompleto: (v: string) => void;
  cpf: string;
  setCpf: (v: string) => void;
  telefone: string;
  setTelefone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  nextTab: () => void;
}

// Máscaras simples
const mascaraCpf = (v: string) =>
  v.replace(/\D/g, '')
   .replace(/(\d{3})(\d)/, '$1.$2')
   .replace(/(\d{3})(\d)/, '$1.$2')
   .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const mascaraTelefone = (v: string) =>
  v.replace(/\D/g, '')
   .replace(/(\d{2})(\d)/, '($1) $2')
   .replace(/(\d{5})(\d)/, '$1-$2')
   .slice(0, 15);

export default function DadosPessoais({
  nomeCompleto,
  setNomeCompleto,
  cpf,
  setCpf,
  telefone,
  setTelefone,
  email,
  setEmail,
  loading,
  nextTab,
}: DadosPessoaisProps) {
  // Validações básicas antes de passar para endereço
  const handleNext = () => {
    if (!nomeCompleto.trim()) return alert('Preencha o nome completo');
    if (cpf.replace(/\D/g, '').length !== 11) return alert('CPF inválido');
    if (telefone.replace(/\D/g, '').length < 10) return alert('Telefone inválido');
    if (!email.trim()) return alert('Preencha o email');
    nextTab();
  };

  return (
    <>
      <input
        value={nomeCompleto}
        onChange={e => setNomeCompleto(e.target.value)}
        placeholder="Nome completo"
        className="form-control mb-2"
        disabled={loading}
        autoFocus
      />
      <input
        value={cpf}
        onChange={e => setCpf(mascaraCpf(e.target.value))}
        placeholder="CPF"
        className="form-control mb-2"
        maxLength={14}
        disabled={loading}
      />
      <input
        value={telefone}
        onChange={e => setTelefone(mascaraTelefone(e.target.value))}
        placeholder="Telefone"
        className="form-control mb-2"
        maxLength={15}
        disabled={loading}
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="form-control mb-2"
        disabled={loading}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleNext}
        disabled={loading}
      >
        Próximo
      </button>
    </>
  );
}
