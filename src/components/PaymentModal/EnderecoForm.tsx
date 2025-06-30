'use client';

import React from 'react';

interface EnderecoProps {
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
  loading: boolean;
  nextTab: () => void;
  prevTab: () => void;
}

const mascaraCep = (v: string) =>
  v.replace(/\D/g, '')
   .replace(/(\d{5})(\d)/, '$1-$2')
   .slice(0, 9);

export default function Endereco({
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
  loading,
  nextTab,
  prevTab,
}: EnderecoProps) {
  // Validações simples antes de passar para pagamento
  const handleNext = () => {
    if (cep.replace(/\D/g, '').length !== 8) return alert('CEP inválido');
    if (!endereco.trim()) return alert('Preencha o endereço');
    if (!numero.trim()) return alert('Preencha o número');
    if (!bairro.trim()) return alert('Preencha o bairro');
    if (!cidade.trim()) return alert('Preencha a cidade');
    if (estado.trim().length !== 2) return alert('Estado inválido');
    nextTab();
  };

  return (
    <>
      <input
        value={cep}
        onChange={e => setCep(mascaraCep(e.target.value))}
        placeholder="CEP"
        className="form-control mb-2"
        maxLength={9}
        disabled={loading}
      />
      <input
        value={endereco}
        onChange={e => setEndereco(e.target.value)}
        placeholder="Endereço"
        className="form-control mb-2"
        disabled={loading}
      />
      <div className="d-flex gap-2 mb-2">
        <input
          value={numero}
          onChange={e => setNumero(e.target.value)}
          placeholder="Número"
          className="form-control"
          disabled={loading}
        />
        <input
          value={complemento}
          onChange={e => setComplemento(e.target.value)}
          placeholder="Complemento"
          className="form-control"
          disabled={loading}
        />
      </div>
      <input
        value={bairro}
        onChange={e => setBairro(e.target.value)}
        placeholder="Bairro"
        className="form-control mb-2"
        disabled={loading}
      />
      <div className="d-flex gap-2 mb-2">
        <input
          value={cidade}
          onChange={e => setCidade(e.target.value)}
          placeholder="Cidade"
          className="form-control"
          disabled={loading}
        />
        <input
          value={estado}
          onChange={e => setEstado(e.target.value.toUpperCase())}
          placeholder="UF"
          maxLength={2}
          className="form-control"
          disabled={loading}
        />
      </div>
      <div className="d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={prevTab}
          disabled={loading}
        >
          Voltar
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
          disabled={loading}
        >
          Próximo
        </button>
      </div>
    </>
  );
}
