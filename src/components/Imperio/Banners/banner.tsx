'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import Link from 'next/link';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import useBanners from '@/Hooks/useBanners';

export default function BannerCarousel() {
  const { banners, loading, error } = useBanners();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div
          className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
          role="status"
          aria-label="Carregando banners"
        ></div>
        <p className="mt-4 text-gray-700">Carregando banners...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md text-center min-h-screen flex items-center justify-center" role="alert">
        {error}
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className="bg-blue-100 text-blue-700 p-4 rounded-md text-center min-h-screen flex items-center justify-center" role="alert">
        Nenhum banner disponível.
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={4000}
        transitionTime={800}
        emulateTouch
        swipeable
        ariaLabel="Carrossel de banners"
        className="h-full"
      >
        {banners.map((banner) => {
          const imgSrc = banner.imagem_blob
            ? `data:image/png;base64,${banner.imagem_blob}`
            : '/img/Logotipo.png';

          const ofertaUrl = banner.oferta_id ? `/ofertas/${banner.oferta_id}` : null;

          const captionContent = (
            <div
              className={`bg-black bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-lg mx-auto text-center
                transition duration-300 ease-in-out
                ${ofertaUrl ? 'hover:bg-opacity-85 cursor-pointer' : 'cursor-default'}`}
            >
              <h3 className="text-4xl font-extrabold text-white drop-shadow-lg">{banner.titulo}</h3>

              {ofertaUrl ? (
                <>
                  <p className="mt-3 text-sm italic text-gray-300 drop-shadow-md">
                    Oferta: {banner.oferta_titulo || 'Sem título'}
                  </p>
                  <Link
                    href={ofertaUrl}
                    className="inline-block mt-5 px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
                    aria-label={`Ver mais sobre oferta ${banner.oferta_titulo || 'Sem título'}`}
                    onClick={(e) => e.stopPropagation()} // evita clique duplo
                  >
                    Ver mais
                  </Link>
                </>
              ) : (
                <button
                  disabled
                  className="mt-5 px-6 py-3 bg-gray-500 text-gray-300 font-semibold rounded cursor-not-allowed"
                >
                  Sem oferta
                </button>
              )}
            </div>
          );

          if (ofertaUrl) {
            return (
              <div
                key={banner.id}
                className="relative w-full h-screen cursor-pointer"
                onClick={() => window.location.href = ofertaUrl}
                aria-label={`Banner com oferta ${banner.oferta_titulo || banner.titulo}`}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    window.location.href = ofertaUrl;
                  }
                }}
              >
                <div className="relative w-full h-full" aria-hidden="true">
                  <Image
                    src={imgSrc}
                    alt={banner.titulo || 'Banner'}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                </div>

                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full px-4">
                  {captionContent}
                </div>
              </div>
            );
          }

          return (
            <div key={banner.id} className="relative w-full h-screen">
              <div className="relative w-full h-full">
                <Image
                  src={imgSrc}
                  alt={banner.titulo || 'Banner'}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  priority
                />
              </div>

              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full px-4">
                {captionContent}
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}
