'use client';

import React, { useEffect, useState } from 'react';
import creditCardType from 'credit-card-type';
import axios from '@/service/Conexao/conn';
import Swal from 'sweetalert2';

import { ResumoCompraItem } from '@/types/types';

interface DadosPessoais {
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  email: string;
}

interface Endereco {
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface PagamentoProps {
  total: number;
  resumoCompra: ResumoCompraItem[];
  dadosPessoais: DadosPessoais;
  endereco: Endereco;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (msg: string | null) => void;
  successMsg: string | null;
  setSuccessMsg: (msg: string | null) => void;
  prevTab: () => void;
  onClose: () => void;
}

const mascaraCartao = (v: string) =>
  v.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19);

const mascaraValidade = (v: string) =>
  v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

export default function Pagamento({
  total,
  resumoCompra,
  dadosPessoais,
  endereco,
  loading,
  setLoading,
  error,
  setError,
  successMsg,
  setSuccessMsg,
  prevTab,
  onClose,
}: PagamentoProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cartao' | 'pix'>('cartao');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<string | null>(null);

  // Carregar SDK MercadoPago (caso queira futuramente)
  useEffect(() => {
    if (!document.getElementById('mp-sdk')) {
      const script = document.createElement('script');
      script.id = 'mp-sdk';
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Detecta bandeira do cartão ao digitar número
  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const types = creditCardType(cleanNumber);
    if (types.length > 0) {
      setCardBrand(types[0].niceType);
    } else {
      setCardBrand(null);
    }
  }, [cardNumber]);

  const handleSubmit = async () => {
    if (loading) return;
    setError(null);
    setSuccessMsg(null);

    // Validações básicas dos dados pessoais
    if (!dadosPessoais.nomeCompleto.trim()) return setError('Preencha o nome completo');
    if (!dadosPessoais.cpf.replace(/\D/g, '').match(/^\d{11}$/)) return setError('CPF inválido');
    if (!dadosPessoais.telefone.replace(/\D/g, '').match(/^\d{10,11}$/)) return setError('Telefone inválido');
    if (!dadosPessoais.email.trim()) return setError('Email inválido');

    // Validações do endereço
    if (!endereco.cep.replace(/\D/g, '').match(/^\d{8}$/)) return setError('CEP inválido');
    if (!endereco.endereco.trim()) return setError('Endereço inválido');
    if (!endereco.numero.trim()) return setError('Número inválido');
    if (!endereco.bairro.trim()) return setError('Bairro inválido');
    if (!endereco.cidade.trim()) return setError('Cidade inválida');
    if (!endereco.estado.trim().match(/^[A-Z]{2}$/)) return setError('Estado inválido');

    // Validações do cartão, se método cartão
    if (paymentMethod === 'cartao') {
      if (cardNumber.replace(/\s/g, '').length < 13) return setError('Número do cartão inválido');
      if (!cardName.trim()) return setError('Nome no cartão é obrigatório');
      if (cardExpiry.length !== 5) return setError('Validade inválida');
      if (cardCvv.length < 3) return setError('CVV inválido');
    }

    setLoading(true);

    try {
      const payload = {
        dadosPessoais,
        endereco,
        pagamento: {
          metodo: paymentMethod,
          ...(paymentMethod === 'cartao'
            ? {
                numero: cardNumber.replace(/\s/g, ''),
                nome: cardName,
                validade: cardExpiry,
                cvv: cardCvv,
                bandeira: cardBrand,
              }
            : {}),
        },
        itens: resumoCompra,
        total,
      };

      const response = await axios.post('/pedido/criar', payload);

      if (response.status === 201) {
        setSuccessMsg('Pagamento realizado com sucesso!');
        setLoading(false);

        await Swal.fire({
          icon: 'success',
          title: 'Pagamento aprovado!',
          text: 'Seu pedido foi cadastrado com sucesso.',
          confirmButtonText: 'OK',
        });

        await Swal.fire({
          icon: 'info',
          title: 'Atenção',
          html: `
            O painel de acompanhamento de pedidos ainda está em desenvolvimento.<br/>
            Por favor, entre em contato diretamente com a dona do sistema para acompanhar seu pedido.
          `,
          confirmButtonText: 'Fechar',
        });

        onClose();
      } else {
        setError('Erro ao processar pagamento');
        setLoading(false);
      }
    } catch (error: unknown) {
      let message = 'Erro inesperado';

      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: unknown }).response === 'object' &&
        (error as { response?: { data?: unknown } }).response !== null &&
        'data' in (error as { response: { data?: unknown } }).response &&
        typeof (error as { response: { data?: { erro?: unknown } } }).response.data === 'object' &&
        (error as { response: { data?: { erro?: unknown } } }).response.data !== null &&
        'erro' in (error as { response: { data: { erro?: unknown } } }).response.data &&
        typeof (error as { response: { data: { erro?: string } } }).response.data.erro === 'string'
      ) {
        message = (error as { response: { data: { erro: string } } }).response.data.erro;
      } else if (error instanceof Error) {
        message = error.message;
      }

      setError(message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-check mb-3">
        <input
          type="radio"
          id="pag-cartao"
          name="paymentMethod"
          value="cartao"
          checked={paymentMethod === 'cartao'}
          onChange={() => setPaymentMethod('cartao')}
          disabled={loading}
          className="form-check-input"
        />
        <label htmlFor="pag-cartao" className="form-check-label">
          Cartão de Crédito
        </label>
      </div>
      <div className="form-check mb-3">
        <input
          type="radio"
          id="pag-pix"
          name="paymentMethod"
          value="pix"
          checked={paymentMethod === 'pix'}
          onChange={() => setPaymentMethod('pix')}
          disabled={loading}
          className="form-check-input"
        />
        <label htmlFor="pag-pix" className="form-check-label">
          Pix
        </label>
      </div>

      {paymentMethod === 'cartao' && (
        <>
          <input
            type="text"
            placeholder="Número do cartão"
            value={cardNumber}
            onChange={e => setCardNumber(mascaraCartao(e.target.value))}
            maxLength={19}
            className="form-control mb-2"
            disabled={loading}
            autoComplete="cc-number"
          />
          {cardBrand && <small className="text-muted mb-2">Bandeira: {cardBrand}</small>}
          <input
            type="text"
            placeholder="Nome no cartão"
            value={cardName}
            onChange={e => setCardName(e.target.value)}
            className="form-control mb-2"
            disabled={loading}
            autoComplete="cc-name"
          />
          <div className="d-flex gap-2">
            <input
              type="text"
              placeholder="Validade (MM/AA)"
              value={cardExpiry}
              onChange={e => setCardExpiry(mascaraValidade(e.target.value))}
              maxLength={5}
              className="form-control"
              disabled={loading}
              autoComplete="cc-exp"
            />
            <input
              type="password"
              placeholder="CVV"
              value={cardCvv}
              onChange={e => setCardCvv(e.target.value)}
              maxLength={4}
              className="form-control"
              disabled={loading}
              autoComplete="cc-csc"
            />
          </div>
        </>
      )}

      {paymentMethod === 'pix' && (
        <div className="alert alert-info">
          Você poderá realizar o pagamento via Pix após confirmar o pedido.
        </div>
      )}

      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {successMsg && <div className="alert alert-success mt-2">{successMsg}</div>}

      <div className="d-flex justify-content-between mt-3">
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
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Confirmar Pagamento'}
        </button>
      </div>
    </>
  );
}
