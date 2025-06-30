'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserDropdown() {
  const [show, setShow] = useState(false);
  const { usuario, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userIcon = document.getElementById('userDropdownToggle');
      const userMenu = document.getElementById('userDropdownMenu');
      if (
        userIcon &&
        !userIcon.contains(event.target as Node) &&
        userMenu &&
        !userMenu.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShow(false);
    router.push('/'); // Navegação SPA para home após logout
  };

  return (
    <div className="position-relative" style={{ cursor: 'pointer', userSelect: 'none' }}>
      <button
        id="userDropdownToggle"
        className="d-flex align-items-center gap-2 btn btn-link text-decoration-none text-dark"
        aria-haspopup="true"
        aria-expanded={show}
        onClick={(e) => {
          e.stopPropagation();
          setShow(prev => !prev);
        }}
        aria-label="Menu do usuário"
        type="button"
        style={{ padding: '0.2rem 0.5rem' }}
      >
        <i className="bi bi-person-circle fs-4"></i>
        {usuario && (
          <span style={{ fontWeight: 600, userSelect: 'text' }}>
            {usuario.nome.split(' ')[0]} {/* só o primeiro nome */}
          </span>
        )}
      </button>

      {show && (
        <div
          id="userDropdownMenu"
          className="dropdown-menu show"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 6px)',
            minWidth: '160px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            padding: '0.6rem 0',
            zIndex: 9999,
            fontWeight: 600,
            color: '#5a2a2a',
            userSelect: 'none',
          }}
          onClick={e => e.stopPropagation()}
          role="menu"
          aria-label="Menu do usuário"
        >
          {usuario ? (
            <>
              <div
                className="dropdown-item d-flex align-items-center gap-2"
                role="menuitem"
                style={{ cursor: 'default', color: '#5a2a2a', padding: '10px 20px' }}
              >
                <i className="bi bi-person"></i>
                {usuario.nome}
              </div>
              <div
                className="dropdown-item d-flex align-items-center gap-2"
                role="menuitem"
                onClick={handleLogout}
                style={{ cursor: 'pointer', color: '#5a2a2a', padding: '10px 20px' }}
              >
                <i className="bi bi-box-arrow-right"></i>
                Sair
              </div>
            </>
          ) : (
            <>
              <Link
                href="/Login"
                className="dropdown-item d-flex align-items-center gap-2"
                role="menuitem"
                onClick={() => setShow(false)}
                style={{ cursor: 'pointer', color: '#5a2a2a', padding: '10px 20px', textDecoration: 'none' }}
              >
                <i className="bi bi-box-arrow-in-right"></i>
                Entrar
              </Link>
              <Link
                href="/Cadastro"
                className="dropdown-item d-flex align-items-center gap-2"
                role="menuitem"
                onClick={() => setShow(false)}
                style={{ cursor: 'pointer', color: '#5a2a2a', padding: '10px 20px', textDecoration: 'none' }}
              >
                <i className="bi bi-pencil-square"></i>
                Cadastrar
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
