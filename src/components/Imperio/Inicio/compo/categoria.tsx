'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import useCategorias from '@/Hooks/useCategorias';
import useDropdown from '@/Hooks/Dropdrom/useDropdown';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function CategoriesDropdown() {
  const { categorias, loading, error, fetchCategorias } = useCategorias();

  const {
    isOpen,
    toggle,
    dropdownPos,
    triggerRef,
    dropdownRef,
    setIsOpen,
  } = useDropdown<HTMLDivElement>();

  useEffect(() => {
    if (isOpen && categorias.length === 0 && !loading) {
      fetchCategorias();
    }
  }, [isOpen, categorias.length, loading, fetchCategorias]);

  return (
    <>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        className="relative z-50 px-4 flex items-center gap-2 cursor-pointer text-base font-semibold text-gray-800 hover:text-indigo-600 transition select-none"
      >
        <i className="bi bi-list-ul text-lg" style={{ marginRight: '8px' }} />
        <span>Categorias</span>
        <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'} text-sm ml-1`} />
      </div>

      {/* Dropdown */}
      {isOpen && dropdownPos &&
        createPortal(
          <div
            id="categoryDropdownMenu"
            ref={dropdownRef}
            role="menu"
            style={{
              position: 'absolute',
              top: dropdownPos.top + 12,
              left: dropdownPos.left,
              zIndex: 9999,
              minWidth: '280px',
              maxHeight: '360px',
              borderRadius: '14px',
              background:
                'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
              border: '1px solid #cbd5e1',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
              padding: '12px 0',
              overflowY: 'auto',

              // Efeito 3D e perspectiva
              transformStyle: 'preserve-3d',
              perspective: 800,
              transformOrigin: 'top center',
              // iniciando levemente rotacionado e plano (pode animar se quiser)
              // transform: 'rotateX(0deg)', // pode usar pra animar depois
            }}
            onClick={(e) => e.stopPropagation()}
            className="custom-scrollbar flex flex-col"
          >
            {loading && (
              <p className="px-6 py-4 text-sm text-gray-500 select-none">Carregando categorias...</p>
            )}
            {error && (
              <p className="px-6 py-4 text-sm text-red-600 select-none">{error}</p>
            )}
            {!loading && !error && categorias.length === 0 && (
              <p className="px-6 py-4 text-sm text-gray-500 select-none">Nenhuma categoria encontrada.</p>
            )}
            {!loading && !error && categorias.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/categoria/${encodeURIComponent(cat.nome)}`}
                role="menuitem"
                className={`flex items-center gap-3 px-6 py-3 text-base text-gray-800 no-underline rounded-md transition-transform duration-300
                  hover:bg-indigo-100 hover:text-indigo-900 hover:shadow-lg hover:-translate-y-1
                  ${i !== categorias.length - 1 ? 'border-b border-gray-200' : ''}
                `}
                onClick={() => setIsOpen(false)}
                style={{ textDecoration: 'none', transformStyle: 'preserve-3d' }}
              >
                <i className="bi bi-tag-fill text-indigo-600 text-lg" />
                <span className="whitespace-nowrap">{cat.nome}</span>
              </Link>
            ))}
          </div>,
          document.body
        )}

      {/* Scrollbar customizada */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100, 100, 100, 0.25);
          border-radius: 8px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 100, 100, 0.4);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 100, 100, 0.25) transparent;
        }
      `}</style>
    </>
  );
}
