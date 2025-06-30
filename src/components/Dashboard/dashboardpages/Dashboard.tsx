"use client";

import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaHome,
  FaUsers,
  FaShoppingCart,
  FaBoxOpen,
  FaCogs,
  FaUser,
  FaImage,
  FaChevronDown,
  FaSun,
  FaMoon,
  FaTicketAlt, // ícone para cupom
} from "react-icons/fa";
import SidebarLink from "./sidebarlink";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import BannerListar from "@/app/Dashboard/Banners/Listrar/page";
import Categorias from "@/app/Dashboard/Categorias/page";
import CadastroImagemCard from "@/app/Dashboard/Imagens/page";
import OfertasListar from "@/app/Dashboard/Ofertas/page";
import CadastraProdutos from "@/app/Dashboard/Produtos/page";
import UsuariosPage from "@/app/Dashboard/Usuarios/page";

import UCards from "@/app/Dashboard/Cards/page";
import BannerPage from "@/app/Dashboard/Banners/page";
import CadastrarCupom from "@/app/Dashboard/Cupons/page";
import ListarCupons from "@/app/Dashboard/Cupons/Listrar/page";
import Pedido from "@/app/Dashboard/Pedido/page";

import axios from "@/service/Conexao/conn"; // aqui você importa sua instância axios personalizada

export default function Dashboard() {
  const [menuAberto, setMenuAberto] = useState(true);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [paginaAtiva, setPaginaAtiva] = useState("inicio");
  const [tema, setTema] = useState<"light" | "dark">("dark");

  const [submenuUsuarios, setSubmenuUsuarios] = useState(false);
  const [submenuProdutos, setSubmenuProdutos] = useState(false);
  const [submenuBanners, setSubmenuBanners] = useState(false);
  const [submenuCupons, setSubmenuCupons] = useState(false); // submenu cupons

  const router = useRouter();
  const { setUsuario } = useAuth();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) setPaginaAtiva(hash);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  const alternarTema = () => {
    setTema((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const mudarPagina = (pagina: string) => {
    setPaginaAtiva(pagina);
    window.history.replaceState(null, "", `#${pagina}`);
  };

  async function handleLogout() {
    try {
      const res = await axios.post("/autenticar/logout", null, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUsuario(null);
        router.push("/Login");
      } else {
        alert("Erro ao sair.");
      }
    } catch (error) {
      alert("Erro na requisição de logout.");
      console.error(error);
    }
  }

  return (
    <div className="dashboard-container">
      {/* Navbar topo */}
      <nav className="dashboard-navbar">
        <div className="dashboard-navbar-left">
          <FaBars
            onClick={() => setMenuAberto(!menuAberto)}
            className="icon-button"
            title="Abrir/Fechar menu"
          />
          <h1 className="dashboard-title">Império Admin</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="mode-toggle-button"
            onClick={alternarTema}
            title="Alternar tema"
          >
            {tema === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          <div
            className={`profile-dropdown ${perfilAberto ? "open" : ""}`}
            onClick={() => setPerfilAberto(!perfilAberto)}
            tabIndex={0}
            onBlur={() => setPerfilAberto(false)}
          >
            <FaUser size={18} />
            <span>Administrador</span>
            <FaChevronDown />
            {perfilAberto && (
              <div className="profile-dropdown-menu">
                <a href="/perfil" className="profile-dropdown-item">
                  Meu Perfil
                </a>
                <button
                  type="button"
                  className="profile-dropdown-item logout-button"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${menuAberto ? "open" : "closed"}`}>
          {menuAberto && (
            <div className="dashboard-sidebar-header">Império Admin</div>
          )}
          <nav className="dashboard-sidebar-nav">
            <SidebarLink
              onClick={() => mudarPagina("inicio")}
              icon={<FaHome />}
              text="Início"
              open={menuAberto}
              ativo={paginaAtiva === "inicio"}
            />

            {/* Usuários */}
            <SidebarLink
              onClick={() => setSubmenuUsuarios(!submenuUsuarios)}
              icon={<FaUsers />}
              text="Usuários"
              open={menuAberto}
              ativo={paginaAtiva.startsWith("usuarios")}
              isDropdown
              isOpen={submenuUsuarios}
            />
            {submenuUsuarios && menuAberto && (
              <div className="submenu-indent">
                <SidebarLink
                  onClick={() => mudarPagina("usuarios")}
                  icon="👥"
                  text="Gerenciar Usuários"
                  open={true}
                  ativo={paginaAtiva === "usuarios"}
                />
              </div>
            )}

            {/* Pedidos */}
            <SidebarLink
              onClick={() => mudarPagina("pedidos")}
              icon={<FaShoppingCart />}
              text="Pedidos"
              open={menuAberto}
              ativo={paginaAtiva === "pedidos"}
            />

            {/* Produtos */}
            <SidebarLink
              onClick={() => setSubmenuProdutos(!submenuProdutos)}
              icon={<FaBoxOpen />}
              text="Produtos"
              open={menuAberto}
              ativo={
                paginaAtiva.startsWith("produtos") ||
                paginaAtiva === "categorias" ||
                paginaAtiva === "imagens" ||
                paginaAtiva === "ofertas"
              }
              isDropdown
              isOpen={submenuProdutos}
            />
            {submenuProdutos && menuAberto && (
              <div className="submenu-indent">
                <SidebarLink
                  onClick={() => mudarPagina("produtos")}
                  icon="📦"
                  text="Gerenciar Produtos"
                  open={true}
                  ativo={paginaAtiva === "produtos"}
                />
                <SidebarLink
                  onClick={() => mudarPagina("categorias")}
                  icon="🏷️"
                  text="Gerenciar Categorias"
                  open={true}
                  ativo={paginaAtiva === "categorias"}
                />
                <SidebarLink
                  onClick={() => mudarPagina("imagens")}
                  icon="🖼️"
                  text="Gerenciar Imagens"
                  open={true}
                  ativo={paginaAtiva === "imagens"}
                />
                <SidebarLink
                  onClick={() => mudarPagina("ofertas")}
                  icon="💸"
                  text="Gerenciar Ofertas"
                  open={true}
                  ativo={paginaAtiva === "ofertas"}
                />
              </div>
            )}

            {/* Banners */}
            <SidebarLink
              onClick={() => setSubmenuBanners(!submenuBanners)}
              icon={<FaImage />}
              text="Banners"
              open={menuAberto}
              ativo={
                paginaAtiva === "cadastrar-banner" ||
                paginaAtiva === "listar-banners"
              }
              isDropdown
              isOpen={submenuBanners}
            />
            {submenuBanners && menuAberto && (
              <div className="submenu-indent">
                <SidebarLink
                  onClick={() => mudarPagina("cadastrar-banner")}
                  icon="➕"
                  text="Cadastrar Banner"
                  open={true}
                  ativo={paginaAtiva === "cadastrar-banner"}
                />
                <SidebarLink
                  onClick={() => mudarPagina("listar-banners")}
                  icon="📋"
                  text="Listar Banners"
                  open={true}
                  ativo={paginaAtiva === "listar-banners"}
                />
              </div>
            )}

            {/* Cupons */}
            <SidebarLink
              onClick={() => setSubmenuCupons(!submenuCupons)}
              icon={<FaTicketAlt />}
              text="Cupons"
              open={menuAberto}
              ativo={
                paginaAtiva === "cadastrar-cupom" ||
                paginaAtiva === "listar-cupons"
              }
              isDropdown
              isOpen={submenuCupons}
            />
            {submenuCupons && menuAberto && (
              <div className="submenu-indent">
                <SidebarLink
                  onClick={() => mudarPagina("cadastrar-cupom")}
                  icon="➕"
                  text="Cadastrar Cupom"
                  open={true}
                  ativo={paginaAtiva === "cadastrar-cupom"}
                />
                <SidebarLink
                  onClick={() => mudarPagina("listar-cupons")}
                  icon="📋"
                  text="Listar Cupons"
                  open={true}
                  ativo={paginaAtiva === "listar-cupons"}
                />
              </div>
            )}

            {/* Configurações */}
            <SidebarLink
              onClick={() => mudarPagina("config")}
              icon={<FaCogs />}
              text="Configurações"
              open={menuAberto}
              ativo={paginaAtiva === "config"}
            />
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="dashboard-main">
          {paginaAtiva === "inicio" && <UCards />}
          {paginaAtiva === "usuarios" && <UsuariosPage />}
          {paginaAtiva === "pedidos" && <Pedido />}
          {paginaAtiva === "produtos" && <CadastraProdutos />}
          {paginaAtiva === "categorias" && <Categorias />}
          {paginaAtiva === "imagens" && <CadastroImagemCard />}
          {paginaAtiva === "ofertas" && <OfertasListar />}
          {paginaAtiva === "cadastrar-banner" && <BannerPage />}
          {paginaAtiva === "listar-banners" && <BannerListar />}
          {paginaAtiva === "config" && <h2>Configurações</h2>}

          {/* Cupons */}
          {paginaAtiva === "cadastrar-cupom" && <CadastrarCupom />}
          {paginaAtiva === "listar-cupons" && <ListarCupons />}
        </main>
      </div>
    </div>
  );
}
