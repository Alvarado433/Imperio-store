'use client';

import React from 'react';

interface PagamentoFormProps {
  paymentMethod: 'cartao' | 'pix';
  setPaymentMethod: (v: 'cartao' | 'pix') => void;
  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardName: string;
  setCardName: (v: string) => void;
  cardExpiry: string;
  setCardExpiry: (v: string) => void;
  cardCvv: string;
  setCardCvv: (v: string) => void;
  mascaraCartao: (v: string) => string;
  mascaraValidade: (v: string) => string;
  onBack: () => void;
}

export default function PagamentoForm({
  paymentMethod,
  setPaymentMethod,
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  mascaraCartao,
  mascaraValidade,
  onBack,
}: PagamentoFormProps) {
  return (
    <fieldset>
      <legend>Pagamento</legend>

      <div className="form-check mb-2">
        <input
          type="radio"
          id="cartao"
          checked={paymentMethod === 'cartao'}
          onChange={() => setPaymentMethod('cartao')}
        />
        <label htmlFor="cartao">Cartão de Crédito</label>
      </div>
      <div className="form-check mb-3">
        <input
          type="radio"
          id="pix"
          checked={paymentMethod === 'pix'}
          onChange={() => setPaymentMethod('pix')}
        />
        <label htmlFor="pix">PIX</label>
      </div>

      {paymentMethod === 'cartao' && (
        <>
          <input
            className="form-control mb-2"
            placeholder="Número do Cartão"
            value={cardNumber}
            onChange={(e) => setCardNumber(mascaraCartao(e.target.value))}
            required
          />
          <input
            className="form-control mb-2"
            placeholder="Nome no Cartão"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
          />
          <div className="d-flex gap-2 mb-3">
            <input
              className="form-control"
              placeholder="Validade (MM/AA)"
              maxLength={5}
              value={cardExpiry}
              onChange={(e) => setCardExpiry(mascaraValidade(e.target.value))}
              required
            />
            <input
              className="form-control"
              placeholder="CVV"
              maxLength={4}
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              required
            />
          </div>
        </>
      )}

      {paymentMethod === 'pix' && (
        <p>Após confirmar, será gerado um QR Code para pagamento via PIX.</p>
      )}

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" type="button" onClick={onBack}>
          Voltar
        </button>
        <button className="btn btn-primary" type="submit">
          Confirmar Pagamento
        </button>
      </div>
    </fieldset>
  );
}
