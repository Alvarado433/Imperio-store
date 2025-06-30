'use client';
import React from 'react';
import {
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-section about">
          <h6>Sobre Nós</h6>
          <p>
            Produtos com amor, estilo e oportunidade de renda extra. Moda, festas e presentes especiais em um só lugar!
          </p>
        </div>

        <div className="footer-section links">
          <h6>Links Úteis</h6>
          <ul>
            <li><a href="#">Política de Privacidade</a></li>
            <li><a href="#">Trocas e Devoluções</a></li>
            <li><a href="#">Termos de Uso</a></li>
            <li><a href="#">Contato</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h6>Fale Conosco</h6>
          <p><FaWhatsapp className="icon" /> <a href="https://wa.me/55119991483834" target="_blank" rel="noreferrer">(11) 99148-3834</a></p>
          <p><FaEnvelope className="icon" /> <a href="mailto:imperiofestasecestas@gmail.com">imperiofestasecestas@gmail.com</a></p>
          <p><FaMapMarkerAlt className="icon" /> Rua Manoel Fernandes, Jundiapeba, Mogi das Cruzes - SP</p>
        </div>

        <div className="footer-section social">
          <h6>Siga-nos</h6>
          <div className="social-icons">
            <a href="https://www.instagram.com/imperio_festas12" target="_blank" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Facebook" aria-disabled="true">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" aria-disabled="true">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Império das Cestas Atacado – Todos os direitos reservados.
      </div>

      <style jsx>{`
        .footer {
          background: #b33951;
          color: #fff0f6;
          padding: 4rem 2rem 2rem;
          border-top: 4px solid #8a2c3b;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-section h6 {
          font-size: 1.4rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          color: #ffd6e8;
          border-bottom: 2px solid #ff85a2;
          padding-bottom: 0.4rem;
        }

        .footer-section p,
        .footer-section li {
          font-size: 1rem;
          line-height: 1.8;
          color: #ffe6f0;
        }

        .footer-section a {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-section a:hover {
          color: #ff9db5;
        }

        .icon {
          margin-right: 0.6rem;
          color: #ffb3cc;
          font-size: 1.2rem;
          vertical-align: middle;
        }

        .social-icons {
          display: flex;
          gap: 1.2rem;
          margin-top: 0.5rem;
        }

        .social-icons a {
          font-size: 1.8rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.6rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: #ffd6e8;
        }

        .social-icons a:hover {
          background-color: #ff85a2;
          color: white;
          transform: translateY(-3px);
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          margin-bottom: 0.6rem;
        }

        .footer-bottom {
          text-align: center;
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid #9b2e44;
          font-size: 0.95rem;
          color: #ffd6e8;
        }

        @media (max-width: 600px) {
          .footer {
            padding: 3rem 1.5rem 1.5rem;
          }

          .footer-section h6 {
            font-size: 1.2rem;
          }

          .social-icons a {
            font-size: 1.6rem;
            padding: 0.5rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
