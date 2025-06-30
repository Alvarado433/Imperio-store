'use client';

import React from 'react';
import { ResumoCompraItem } from '@/types/types';

interface ResumoCompraProps {
  resumoCompra: ResumoCompraItem[];
  total: number;
}

export default function ResumoCompra({ resumoCompra, total }: ResumoCompraProps) {
  return (
    <aside className="resumo-compra mt-3">
      <h3>Resumo da Compra</h3>
      <ul className="list-group mb-3">
        {resumoCompra.map((item, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
            {item.nome} x{item.quantidade}
            <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="fw-bold fs-5 text-end">Total: R$ {total.toFixed(2)}</div>
    </aside>
  );
}
