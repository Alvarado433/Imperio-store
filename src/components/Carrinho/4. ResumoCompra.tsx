'use client';

import React from 'react';

interface ResumoCompraProps {
  resumoCompra: { nome: string; quantidade: number; preco: number }[];
  total: number;
}

export default function ResumoCompra({ resumoCompra, total }: ResumoCompraProps) {
  return (
    <aside className="resumo-compra" aria-label="Resumo da compra">
      <h3>Resumo da Compra</h3>
      {resumoCompra.length === 0 ? (
        <p>Nenhum item no carrinho.</p>
      ) : (
        <ul>
          {resumoCompra.map(({ nome, quantidade, preco }, i) => (
            <li key={i}>
              <strong>{nome}</strong> x{quantidade} - R$ {(preco * quantidade).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
      <hr />
      <p className="total">
        <strong>Total: R$ {total.toFixed(2)}</strong>
      </p>
    </aside>
  );
}
