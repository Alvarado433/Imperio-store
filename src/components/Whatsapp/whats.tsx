'use client';
import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppButtonProps {
  phoneNumber: string; // Ex: 5511999999999
  message?: string;
}

const WhatsappButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = 'Olá! Gostaria de mais informações.',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <div
        className="whatsapp-container"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        {showTooltip && <span className="tooltip">Fale conosco!</span>}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-button"
          aria-label="Fale conosco pelo WhatsApp"
        >
          <FaWhatsapp className="icon" aria-hidden="true" />
        </a>
      </div>

      <style jsx>{`
        .whatsapp-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: fadeIn 0.8s ease-out;
        }

        .tooltip {
          background-color: #333;
          color: white;
          padding: 0.4rem 0.7rem;
          border-radius: 8px;
          font-size: 0.85rem;
          white-space: nowrap;
          animation: slideIn 0.3s ease-out;
        }

        .whatsapp-button {
          background-color: #25d366;
          color: white;
          width: 56px;
          height: 56px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s ease, background-color 0.3s ease;
          cursor: pointer;
          animation: pulse 2.5s infinite;
        }

        .whatsapp-button:hover,
        .whatsapp-button:focus-visible {
          background-color: #1ebe5d;
          transform: scale(1.1);
          outline: none;
        }

        .icon {
          font-size: 1.6rem;
        }

        @media (max-width: 600px) {
          .whatsapp-button {
            width: 48px;
            height: 48px;
          }

          .icon {
            font-size: 1.4rem;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(37, 211, 102, 0);
          }
        }
      `}</style>
    </>
  );
};

export default WhatsappButton;
