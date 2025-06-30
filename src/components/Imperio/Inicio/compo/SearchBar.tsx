'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/service/Conexao/conn';

interface ProdutoAPI {
  id: number;
  nome: string;
  preco: number;
  imagens?: { imagem_base64: string }[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export default function SearchBar({ onSearch, onSelectProduct }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [blockDropdown, setBlockDropdown] = useState(false);

  async function fetchProducts(searchTerm: string) {
    if (blockDropdown) return;

    if (!searchTerm.trim()) {
      setFiltered([]);
      setShowDropdown(false);
      if (onSearch) onSearch('');
      return;
    }

    try {
      const response = await api.get(`/produtos/buscar?q=${encodeURIComponent(searchTerm)}`);
      const data = response.data as ProdutoAPI[];

      const mappedProducts = data.map((p) => ({
        id: p.id,
        name: p.nome,
        price: p.preco,
        imageUrl:
          p.imagens && p.imagens.length > 0
            ? `data:image/png;base64,${p.imagens[0].imagem_base64}`
            : '',
      }));

      setFiltered(mappedProducts);
      setShowDropdown(mappedProducts.length > 0);
      if (onSearch) onSearch(searchTerm);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setFiltered([]);
      setShowDropdown(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchProducts(value);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => (i < filtered.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        navigateToProduct(filtered[highlightedIndex]);
        setShowDropdown(false);
        setHighlightedIndex(-1);
        setBlockDropdown(true);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  const navigateToProduct = (product: Product) => {
    setShowDropdown(false);
    setHighlightedIndex(-1);
    setBlockDropdown(true);
    if (onSelectProduct) onSelectProduct(product);

    router.push(`/produto/${product.id}`);
  };

  const clearSearch = () => {
    setQuery('');
    setFiltered([]);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    setBlockDropdown(false);
    if (onSearch) onSearch('');
  };

  useEffect(() => {
    if (!query) {
      setBlockDropdown(false);
    }
  }, [query]);

  return (
    <>
      <style jsx>{`
        .search-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .search-input {
          width: 100%;
          padding: 8px 40px 8px 12px;
          font-size: 1rem;
          border: 2px solid #b35c5c;
          border-radius: 9999px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          outline: none;
          box-sizing: border-box;
          background-color: #fff;
        }
        .search-input:focus {
          border-color: #d48484;
          box-shadow: 0 0 8px rgba(212, 132, 132, 0.6);
          background-color: #fff0f6;
        }
        .clear-button {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          font-size: 1.25rem;
          color: #d48484;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: color 0.2s ease;
        }
        .clear-button:hover {
          color: #b35c5c;
        }
        .dropdown {
          position: absolute;
          width: 100%;
          background: white;
          box-shadow: 0 4px 12px rgba(212, 132, 132, 0.25);
          border-radius: 12px;
          margin-top: 6px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-radius: 8px;
          outline: none;
        }
        .dropdown-item:hover,
        .dropdown-item.highlighted {
          background-color: #f8dede;
        }
        .item-image-wrapper {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          margin-right: 12px;
          flex-shrink: 0;
          overflow: hidden;
          background: #fff0f6;
          border: 1px solid #b35c5c;
        }
        .item-info {
          flex-grow: 1;
          min-width: 0;
        }
        .item-name {
          font-weight: 600;
          color: #7a2f2f;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-price {
          font-size: 0.875rem;
          color: #b35c5c;
          font-weight: 500;
        }
      `}</style>

      <div className="search-container" ref={containerRef}>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar produtos..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => !blockDropdown && setShowDropdown(filtered.length > 0)}
          onKeyDown={handleKeyDown}
          aria-label="Buscar produtos"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            className="clear-button"
            onClick={clearSearch}
            aria-label="Limpar pesquisa"
            title="Limpar pesquisa"
            type="button"
          >
            &times;
          </button>
        )}

        {showDropdown && (
          <div className="dropdown" role="listbox" aria-label="Resultados da busca" tabIndex={-1}>
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className={`dropdown-item ${highlightedIndex === i ? 'highlighted' : ''}`}
                role="option"
                aria-selected={highlightedIndex === i}
                tabIndex={-1}
                onClick={() => navigateToProduct(product)}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                <div className="item-image-wrapper">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      sizes="40px"
                      priority={false}
                    />
                  ) : (
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#7a2f2f',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                      }}
                    >
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="item-info">
                  <div className="item-name" title={product.name}>
                    {product.name}
                  </div>
                  <div className="item-price">
                    R$ {product.price ? product.price.toFixed(2) : '0.00'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
