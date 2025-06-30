'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Logo from './../../../../public/img/Logotipo.png';
import UserDropdown from './compo/user';

import Sidebar from './compo/sidebar';
import CartIcon from './compo/carrinho';
import SearchBar from './compo/SearchBar';
import Produtocate from './compo/cesta';



export default function ImperioStore() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <Navbar className="navbar-custom py-3" expand="lg" fixed="top">
        <Container className="desktop-flex flex-column">
          <div className="d-flex align-items-center w-100">
            <Button
              variant="link"
              className="navbar-toggler custom-toggler d-lg-none"
              onClick={() => setShowMenu(true)}
              aria-label="Abrir menu"
            >
              <i className="bi bi-list"></i>
            </Button>

            <Link href="/" className="navbar-brand mx-lg-0 mx-auto">
              <Image src={Logo} alt="Imperio Store" width={120} height={120} />
            </Link>

            <div className="search-wrapper d-none d-lg-flex flex-grow-1 justify-content-center" style={{ maxWidth: '500px' }}>
              <SearchBar />
            </div>

            <div className="d-flex align-items-center ms-auto">
              <CartIcon />
              <div className="user-dropdown-desktop ms-3">
                <UserDropdown />
              </div>
            </div>
          </div>

         

          <div className="d-none d-lg-block w-100 mt-2">
            <Produtocate />
          </div>
        </Container>
      </Navbar>

      <div style={{ height: '130px' }} />

      <Sidebar show={showMenu} onHide={() => setShowMenu(false)} />
    </>
  );
}
