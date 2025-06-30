"use client";
import React, { useEffect, useState, useRef } from "react";
import { FaGift, FaTruck, FaTags } from "react-icons/fa";

const bannerData = [
  {
    icon: <FaGift />,
    title: "Cestas Especiais",
    description: "Surpreenda em datas comemorativas com nossas cestas personalizadas.",
    bgColor: "rgba(255, 255, 255, 0.15)",
    iconColor: "#fff",
  },
  {
    icon: <FaTruck />,
    title: "Frete Grátis",
    description: "Aproveite frete grátis em compras acima de R$199.",
    bgColor: "rgba(255, 255, 255, 0.15)",
    iconColor: "#fff",
  },
  {
    icon: <FaTags />,
    title: "Descontos Exclusivos",
    description: "Ofertas especiais em produtos selecionados, por tempo limitado.",
    bgColor: "rgba(255, 255, 255, 0.15)",
    iconColor: "#fff",
  },
];

const BannerFilter = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const itemsPerView = 2;
  const totalSlides = Math.ceil(bannerData.length / itemsPerView);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, totalSlides]);

  return (
    <section
      className="highlight-bar-container"
      aria-label="Benefícios e Ofertas"
      onMouseEnter={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }}
      onMouseLeave={() => {
        timeoutRef.current = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % totalSlides);
        }, 5000);
      }}
    >
      <div
        className="slider"
        style={{
          transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
        }}
      >
        {bannerData.map((item, index) => (
          <div
            key={index}
            className="highlight-bar"
            style={{ background: item.bgColor }}
            role="region"
            aria-labelledby={`highlight-title-${index}`}
            aria-describedby={`highlight-desc-${index}`}
          >
            <span className="icon" style={{ color: item.iconColor }}>
              {item.icon}
            </span>
            <div className="text">
              <strong id={`highlight-title-${index}`}>{item.title}</strong>
              <span id={`highlight-desc-${index}`}>{item.description}</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .highlight-bar-container {
          overflow: hidden;
          width: 100%;
          padding: 2.5rem 1rem;
          background: linear-gradient(135deg, #d6336c 0%, #a62852 100%);
        }

        .slider {
          display: flex;
          gap: 1rem;
          transition: transform 0.7s ease-in-out;
          width: calc(100% * ${bannerData.length / itemsPerView});
        }

        .highlight-bar {
          flex: 0 0 calc(100% / ${itemsPerView} - 0.5rem);
          max-width: calc(100% / ${itemsPerView} - 0.5rem);
          display: flex;
          align-items: center;
          padding: 1.2rem 1.8rem;
          border-radius: 1rem;
          backdrop-filter: blur(6px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          color: white;
          cursor: pointer;
        }

        .highlight-bar:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
        }

        .icon {
          font-size: 2.5rem;
          margin-right: 1rem;
          line-height: 1;
        }

        .text strong {
          display: block;
          font-size: 1.2rem;
          margin-bottom: 0.4rem;
          color: white;
        }

        .text span {
          font-size: 1rem;
          color: #f1f1f1;
        }

        @media (max-width: 700px) {
          .highlight-bar {
            flex: 0 0 100%;
            max-width: 100%;
          }
          .slider {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default BannerFilter;
