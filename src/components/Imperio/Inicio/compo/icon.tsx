'use client'
import React from 'react';

interface CartIconProps {
  count: number;
  onClick?: () => void;
  ariaLabel?: string;
}

export default function CartIcon({ count, onClick, ariaLabel = 'Carrinho de compras' }: CartIconProps) {
  return (
    <button
      type="button"
      className="btn btn-link position-relative p-0"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ fontSize: '1.5rem', color: 'inherit' }}
    >
      <i className="bi bi-cart"></i>
      {count > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          aria-label={`${count} itens no carrinho`}
          style={{
            fontSize: '0.75rem',
            minWidth: '1.2rem',
            height: '1.2rem',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
