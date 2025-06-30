'use client';

import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import creditCardType from 'credit-card-type';
import axios from '@/service/Conexao/conn';

import DadosPessoais from '@/components/PaymentModal/DadosForm';
import Endereco from '@/components/PaymentModal/EnderecoForm';

import Image from 'next/image'; // Import para otimização Next.js

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  total: number;
  usuarioId: number;
}

type PixStatus = 'pending' | 'approved' | 'cancelled' | 'unknown';

export default function PaymentModal({
  show,
  onClose,
  total,
  usuarioId,
}: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState<'dados' | 'endereco' | 'pagamento'>('dados');
  const [progressPercent, setProgressPercent] = useState(33);

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'cartao' | 'pix'>('cartao');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados Pix gerados
  const [qrCodePix, setQrCodePix] = useState<string | null>(null);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [pixPaymentId, setPixPaymentId] = useState<string | null>(null);
  const [pixStatus, setPixStatus] = useState<PixStatus>('unknown');

  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const nextTab = () => {
    if (activeTab === 'dados') {
      setActiveTab('endereco');
      setProgressPercent(66);
    } else if (activeTab === 'endereco') {
      setActiveTab('pagamento');
      setProgressPercent(100);
    }
  };

  const prevTab = () => {
    if (activeTab === 'pagamento') {
      setActiveTab('endereco');
      setProgressPercent(66);
    } else if (activeTab === 'endereco') {
      setActiveTab('dados');
      setProgressPercent(33);
    }
  };

  const mascaraCartao = (v: string) =>
    v.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19);

  const mascaraValidade = (v: string) =>
    v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const types = creditCardType(cleanNumber);
    setCardBrand(types.length > 0 ? types[0].niceType : null);
  }, [cardNumber]);

  useEffect(() => {
    if (!document.getElementById('mp-sdk')) {
      const script = document.createElement('script');
      script.id = 'mp-sdk';
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Polling para atualizar status Pix a cada 10s enquanto estiver pendente
  useEffect(() => {
    if (pixPaymentId && pixStatus === 'pending') {
      pollingInterval.current = setInterval(async () => {
        try {
          const resp = await axios.get(`/pix/status/${pixPaymentId}`);
          if (resp.status === 200) {
            const status: PixStatus = resp.data.status;
            setPixStatus(status);
            if (status === 'approved') {
              clearInterval(pollingInterval.current!);
              Swal.fire({
                icon: 'success',
                title: 'Pagamento Confirmado',
                text: 'Seu pagamento via Pix foi aprovado!',
              });
              onClose();
            } else if (status === 'cancelled') {
              clearInterval(pollingInterval.current!);
              Swal.fire({
                icon: 'error',
                title: 'Pagamento Cancelado',
                text: 'Seu pagamento via Pix foi cancelado ou expirou.',
              });
              setQrCodePix(null);
              setPixCode(null);
              setPixPaymentId(null);
              setPixStatus('unknown');
            }
          }
        } catch {
          // Erro ignorado para polling
        }
      }, 10000);

      return () => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      };
    }
  }, [pixPaymentId, pixStatus, onClose]);

  if (!show) return null;

  const handleCopyPixCode = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      Swal.fire('Copiado!', 'Código Pix copiado para área de transferência.', 'success');
    }
  };

  // Corrigido: melhor tipagem do erro
  const handleSubmit = async () => {
    if (loading) return;
    setError(null);
    setQrCodePix(null);
    setPixCode(null);
    setPixPaymentId(null);
    setPixStatus('unknown');
    setLoading(true);

    try {
      if (!nomeCompleto.trim()) throw new Error('Preencha o nome completo');
      if (!cpf.replace(/\D/g, '').match(/^\d{11}$/)) throw new Error('CPF inválido');
      if (!telefone.replace(/\D/g, '').match(/^\d{10,11}$/)) throw new Error('Telefone inválido');
      if (!email.trim()) throw new Error('Email inválido');
      if (!cep.replace(/\D/g, '').match(/^\d{8}$/)) throw new Error('CEP inválido');
      if (!endereco.trim()) throw new Error('Endereço inválido');
      if (!numero.trim()) throw new Error('Número inválido');
      if (!bairro.trim()) throw new Error('Bairro inválido');
      if (!cidade.trim()) throw new Error('Cidade inválida');
      if (!estado.trim().match(/^[A-Z]{2}$/)) throw new Error('Estado inválido');

      if (paymentMethod === 'cartao') {
        if (cardNumber.replace(/\s/g, '').length < 13) throw new Error('Número do cartão inválido');
        if (!cardName.trim()) throw new Error('Nome no cartão é obrigatório');
        if (cardExpiry.length !== 5) throw new Error('Validade inválida');
        if (cardCvv.length < 3) throw new Error('CVV inválido');
      }

      if (paymentMethod === 'pix') {
        const resp = await axios.post('/pix/criar', {
          valor: total,
          nome: nomeCompleto,
          email,
        });

        if (resp.status === 201) {
          setQrCodePix(resp.data.qr_code_base64);
          setPixCode(resp.data.qr_code);
          setPixPaymentId(resp.data.id_pagamento);
          setPixStatus('pending');
        } else {
          throw new Error('Erro ao gerar QR Code Pix');
        }
      } else {
        const resp = await axios.post('/pedido/criar', {
          usuario_id: usuarioId,
          nome_completo: nomeCompleto,
          cpf,
          telefone,
          email,
          cep,
          endereco,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          pagamento: {
            metodo: 'cartao',
            numero: cardNumber.replace(/\s/g, ''),
            nome: cardName,
            validade: cardExpiry,
            cvv: cardCvv,
            bandeira: cardBrand,
          },
          total,
        });

        if (resp.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Pedido Confirmado',
            text: 'Pagamento realizado com sucesso!',
          });
          onClose();
        } else {
          throw new Error('Erro ao processar pagamento');
        }
      }
    } catch (err: unknown) {
      // Tratamento seguro do erro
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="btn-close" aria-label="Fechar modal">
          &times;
        </button>
        <h2>Finalizar Compra - R$ {total.toFixed(2)}</h2>

        <div className="progress-bar-wrapper">
          <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
        </div>

        {activeTab === 'dados' && (
          <DadosPessoais
            nomeCompleto={nomeCompleto}
            setNomeCompleto={setNomeCompleto}
            cpf={cpf}
            setCpf={setCpf}
            telefone={telefone}
            setTelefone={setTelefone}
            email={email}
            setEmail={setEmail}
            loading={loading}
            nextTab={nextTab}
          />
        )}

        {activeTab === 'endereco' && (
          <Endereco
            cep={cep}
            setCep={setCep}
            endereco={endereco}
            setEndereco={setEndereco}
            numero={numero}
            setNumero={setNumero}
            complemento={complemento}
            setComplemento={setComplemento}
            bairro={bairro}
            setBairro={setBairro}
            cidade={cidade}
            setCidade={setCidade}
            estado={estado}
            setEstado={setEstado}
            loading={loading}
            nextTab={nextTab}
            prevTab={prevTab}
          />
        )}

        {activeTab === 'pagamento' && (
          <>
            <div className="form-check mb-3">
              <input
                type="radio"
                id="pag-cartao"
                name="paymentMethod"
                value="cartao"
                checked={paymentMethod === 'cartao'}
                onChange={() => setPaymentMethod('cartao')}
                disabled={loading || qrCodePix !== null}
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
                disabled={loading || qrCodePix !== null}
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
                {cardBrand && (
                  <small className="text-muted mb-2">Bandeira: {cardBrand}</small>
                )}
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
              <>
                {!qrCodePix ? (
                  <div className="alert alert-info">
                    Você poderá realizar o pagamento via Pix após confirmar o pedido.
                  </div>
                ) : (
                  <div className="text-center">
                    <p>
                      Abra seu app de banco, escaneie o QR Code ou copie o código Pix abaixo para
                      realizar o pagamento:
                    </p>
                    {/* Usando Next.js Image para otimização */}
                    <Image
                      src={`data:image/png;base64,${qrCodePix}`}
                      alt="QR Code Pix"
                      width={300}
                      height={300}
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
                      <code
                        style={{
                          userSelect: 'all',
                          padding: '0.5rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          maxWidth: '280px',
                          wordBreak: 'break-word',
                        }}
                      >
                        {pixCode}
                      </code>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleCopyPixCode}
                      >
                        Copiar
                      </button>
                    </div>
                    <p className="mt-3">
                      Status do pagamento: <strong>{pixStatus.toUpperCase()}</strong>
                    </p>
                    {pixStatus === 'pending' && (
                      <small className="text-muted">
                        Aguardando confirmação do pagamento...
                      </small>
                    )}
                  </div>
                )}
              </>
            )}

            {error && <div className="alert alert-danger mt-2">{error}</div>}

            {!qrCodePix && (
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
                  {loading
                    ? 'Processando...'
                    : paymentMethod === 'pix'
                    ? 'Gerar QR Code'
                    : 'Confirmar Pagamento'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        .modal-content {
          position: fixed;
          top: 50%;
          left: 50%;
          max-width: 700px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          transform: translate(-50%, -50%);
          z-index: 1000;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        .btn-close {
          position: absolute;
          top: 12px;
          right: 16px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .progress-bar-wrapper {
          background: #eee;
          border-radius: 10px;
          height: 8px;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        .progress-bar {
          background: #007bff;
          height: 8px;
          border-radius: 10px 0 0 10px;
          transition: width 0.3s ease;
        }
      `}</style>
    </>
  );
}
