"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import api from "@/service/Conexao/conn";
import PaymentModal from "./modal";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface Coupon {
  codigo: string;
  discount?: number; // % de desconto
  freeShipping?: boolean;
  minPrice: number;
  validade?: string; // ISO string
  statusId: number;
  label?: string;
}

export default function CartIcon() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<Coupon | null>(null);
  const [couponApplying, setCouponApplying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { usuario } = useAuth(); // removi loading porque não usava

  // Calcula frete considerando se o cupom tem frete grátis
  const frete = useMemo(() => {
    if (couponApplied?.freeShipping) return 0;
    return 19.9; // Exemplo: frete fixo padrão
  }, [couponApplied]);

  // Calcula subtotal do carrinho (sem desconto)
  const totalSemDesconto = useMemo(() => {
    return cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  }, [cartItems]);

  // Calcula valor do desconto em R$
  const valorDesconto = useMemo(() => {
    if (!couponApplied?.discount) return 0;
    return totalSemDesconto * (couponApplied.discount / 100);
  }, [couponApplied, totalSemDesconto]);

  // Total final = subtotal - desconto + frete
  const totalComDesconto = useMemo(() => {
    return totalSemDesconto - valorDesconto + frete;
  }, [totalSemDesconto, valorDesconto, frete]);

  // Função para exibir mensagens tipo toast
  const exibirToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Busca itens do carrinho do backend
  const listarCarrinho = useCallback(async () => {
    try {
      const res = await api.get<
        {
          id: number;
          quantidade: number;
          produto: { nome: string; preco: number; imagens?: { url: string }[] };
        }[]
      >("/carrinho/L");

      const itensFormatados: CartItem[] = res.data.map((item) => ({
        id: item.id,
        name: item.produto.nome,
        quantity: item.quantidade,
        price: item.produto.preco,
        imageUrl: item.produto.imagens?.[0]?.url || undefined,
      }));

      setCartItems(itensFormatados);
    } catch {
      exibirToast("Erro ao carregar carrinho");
    }
  }, [exibirToast]);

  // Busca cupons ativos e válidos do backend
  const carregarCupons = useCallback(async () => {
    try {
      const res = await api.get<Coupon[]>("/cupons/listar");
      const hoje = new Date();

      const ativos = res.data.filter(
        (c) => c.statusId === 3 && (!c.validade || new Date(c.validade) >= hoje)
      );

      setCoupons(ativos);
    } catch {
      exibirToast("Erro ao carregar cupons");
    }
  }, [exibirToast]);

  // useEffect para carregar carrinho e cupons (com dependências para evitar warning)
  useEffect(() => {
    listarCarrinho();
    carregarCupons();
  }, [listarCarrinho, carregarCupons]);

  // Incrementa quantidade do item no carrinho
  const incrementQty = async (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || item.quantity >= 10) return;
    try {
      await api.put(`/carrinho/atualizar/${id}`, {
        quantidade: item.quantity + 1,
      });
      await listarCarrinho();
    } catch {
      exibirToast("Erro ao atualizar quantidade");
    }
  };

  // Decrementa quantidade do item no carrinho
  const decrementQty = async (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || item.quantity <= 1) return;
    try {
      await api.put(`/carrinho/atualizar/${id}`, {
        quantidade: item.quantity - 1,
      });
      await listarCarrinho();
    } catch {
      exibirToast("Erro ao atualizar quantidade");
    }
  };

  // Abre modal de confirmação para remover item
  const confirmRemove = (item: CartItem) => {
    setItemToRemove(item);
    setShowRemoveModal(true);
  };

  // Remove item do carrinho confirmado
  const handleRemoveConfirmed = async () => {
    if (!itemToRemove) return;
    try {
      await api.delete(`/carrinho/remover/${itemToRemove.id}`);
      await listarCarrinho();
      exibirToast(`"${itemToRemove.name}" removido do carrinho.`);
    } catch {
      exibirToast("Erro ao remover item");
    }
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  // Limpa todo o carrinho
  const clearCart = async () => {
    try {
      await api.delete("/carrinho/limpar");
      setCouponApplied(null);
      setCouponCode("");
      await listarCarrinho();
      exibirToast("Carrinho limpo com sucesso.");
    } catch {
      exibirToast("Erro ao limpar carrinho");
    }
  };

  // Aplica cupom informado no input
  const aplicarCupom = () => {
    if (!couponCode.trim()) return;
    setCouponApplying(true);

    const codigo = couponCode.trim().toUpperCase();
    const cupom = coupons.find((c) => c.codigo.toUpperCase() === codigo);

    setTimeout(() => {
      if (!cupom) {
        exibirToast("Cupom inválido ou expirado.");
        setCouponApplied(null);
      } else if (totalSemDesconto < cupom.minPrice) {
        exibirToast(
          `Pedido mínimo de R$ ${cupom.minPrice.toFixed(
            2
          )} para usar este cupom.`
        );
        setCouponApplied(null);
      } else {
        setCouponApplied(cupom);
        exibirToast(`Cupom ${cupom.codigo} aplicado com sucesso!`);
      }
      setCouponApplying(false);
    }, 1500);
  };

  // Remove cupom aplicado
  const removerCupom = () => {
    setCouponApplied(null);
    setCouponCode("");
    exibirToast("Cupom removido.");
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-link position-relative p-0"
        onClick={() => setShowSidebar(true)}
        style={{ fontSize: "1.5rem", color: "inherit" }}
        aria-label="Abrir carrinho"
      >
        <i className="bi bi-cart"></i>
        {cartItems.length > 0 && (
          <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
          </span>
        )}
      </button>

      {/* Overlay para fechar sidebar clicando fora */}
      <div
        onClick={() => setShowSidebar(false)}
        className={`cart-overlay ${showSidebar ? "show" : ""}`}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: showSidebar ? 1040 : -1,
          opacity: showSidebar ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        aria-hidden={!showSidebar}
      />

      <aside
        className={`cart-sidebar d-flex flex-column bg-white shadow-lg ${
          showSidebar ? "show" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cartSidebarTitle"
        style={{
          position: "fixed",
          top: 0,
          right: showSidebar ? 0 : "-400px",
          width: "350px",
          height: "100vh",
          padding: "1.5rem",
          transition: "right 0.3s ease",
          zIndex: 1050,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h2 id="cartSidebarTitle" className="fs-4 fw-bold">
            Carrinho
          </h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="btn btn-outline-secondary"
            aria-label="Fechar carrinho"
            style={{ fontSize: "1.25rem", lineHeight: 1 }}
          >
            &times;
          </button>
        </header>

        <div
          className="flex-grow-1 overflow-auto"
          style={{ minHeight: 0, maxHeight: "calc(100vh - 250px)" }}
        >
          {cartItems.length === 0 ? (
            <p className="text-center text-muted fs-6">Seu carrinho está vazio.</p>
          ) : (
            <ul className="list-unstyled">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="d-flex align-items-center mb-3 border rounded p-2"
                >
                  {item.imageUrl ? (
                    <div
                      style={{
                        position: "relative",
                        width: 60,
                        height: 60,
                        marginRight: "1rem",
                        flexShrink: 0,
                        borderRadius: "0.25rem",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="60px"
                        priority={false}
                      />
                    </div>
                  ) : null}
                  <div className="flex-grow-1">
                    <h3 className="h6 mb-1">{item.name}</h3>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <div className="fs-6 text-secondary">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Controle de quantidade"
                      >
                        <button
                          onClick={() => decrementQty(item.id)}
                          disabled={item.quantity === 1}
                          className="btn btn-outline-primary btn-sm"
                          title="Diminuir quantidade"
                        >
                          −
                        </button>
                        <span
                          className="btn btn-light btn-sm disabled"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQty(item.id)}
                          className="btn btn-outline-primary btn-sm"
                          title="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => confirmRemove(item)}
                        className="btn btn-outline-danger btn-sm"
                        title={`Remover ${item.name}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Área de cupom */}
        <div className="mt-4">
          <label htmlFor="couponInput" className="form-label fw-semibold">
            Código do cupom
          </label>
          <div className="d-flex">
            <input
              id="couponInput"
              type="text"
              placeholder="Digite seu cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={
                couponApplying || Boolean(couponApplied) || cartItems.length === 0
              }
              className="form-control"
              aria-describedby="couponHelp"
            />
            <button
              onClick={aplicarCupom}
              disabled={
                couponApplying || Boolean(couponApplied) || cartItems.length === 0
              }
              className="btn btn-primary ms-2"
            >
              {couponApplying
                ? "Aplicando..."
                : couponApplied
                ? "Cupom Aplicado"
                : "Aplicar"}
            </button>
          </div>
          {couponApplied && (
            <div
              className="alert alert-success mt-3 d-flex justify-content-between align-items-center"
              role="alert"
            >
              <div>
                🎉 Cupom <strong>{couponApplied.codigo}</strong> aplicado!{" "}
                {couponApplied.discount
                  ? `${couponApplied.discount}% de desconto`
                  : couponApplied.freeShipping
                  ? "Frete grátis"
                  : ""}
              </div>
              <button
                className="btn btn-sm btn-outline-success"
                onClick={removerCupom}
                aria-label="Remover cupom"
              >
                ✖
              </button>
            </div>
          )}
        </div>

        {/* Resumo de valores */}
        <div className="mt-4 border-top pt-3">
          <div className="d-flex justify-content-between mb-1">
            <span>Subtotal</span>
            <span>R$ {totalSemDesconto.toFixed(2)}</span>
          </div>
          {valorDesconto > 0 && (
            <div className="d-flex justify-content-between text-success fw-semibold mb-1">
              <span>Desconto</span>
              <span>- R$ {valorDesconto.toFixed(2)}</span>
            </div>
          )}
          <div className="d-flex justify-content-between mb-1">
            <span>Frete</span>
            <span>
              {frete === 0 ? <span className="text-success">Grátis</span> : `R$ ${frete.toFixed(2)}`}
            </span>
          </div>
          <div className="d-flex justify-content-between fw-bold fs-5 mt-3">
            <span>Total</span>
            <span>R$ {totalComDesconto.toFixed(2)}</span>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="mt-4 d-flex gap-2 flex-wrap">
          <button
            className="btn btn-success flex-grow-1"
            onClick={() => setShowPaymentModal(true)}
            disabled={cartItems.length === 0}
          >
            <i className="bi bi-bag-check-fill me-2"></i> Finalizar Compra
          </button>
          <button
            className="btn btn-outline-secondary flex-grow-1"
            onClick={() => setShowSidebar(false)}
          >
            Continuar Comprando
          </button>
          <button
            className="btn btn-outline-danger flex-grow-1"
            onClick={clearCart}
            disabled={cartItems.length === 0}
          >
            Limpar Carrinho
          </button>
        </div>
      </aside>

      {/* Modal de confirmação de remoção */}
      {showRemoveModal && itemToRemove && (
        <div
          className="modal-overlay d-flex justify-content-center align-items-center"
          onClick={() => setShowRemoveModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 2000,
          }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "400px", width: "90%" }}
          >
            <h3 className="mb-3">Remover item</h3>
            <p>
              Tem certeza que deseja remover <strong>{itemToRemove.name}</strong>{" "}
              do carrinho?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-danger" onClick={handleRemoveConfirmed}>
                Sim, remover
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowRemoveModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast message */}
      {toastMessage && (
        <div
          className="toast-toast bg-dark text-white p-2 rounded fixed-bottom mb-3 mx-auto shadow"
          style={{
            width: "fit-content",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3000,
          }}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {toastMessage}
        </div>
      )}

      {/* Modal de pagamento */}
      {usuario && (
        <PaymentModal
          show={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          total={totalComDesconto}
          usuarioId={usuario.id}
        />
      )}
    </>
  );
}
