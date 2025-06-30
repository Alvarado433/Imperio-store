'use client';

import { useState, useEffect } from 'react';
import axios from '@/service/Conexao/conn';

export interface Banner {
  id: number;
  titulo: string;
  imagem_blob: string | null;
  oferta_id: number | null;
  oferta_titulo?: string;
  nivel_id: number | null;
}

export default function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBanners() {
      try {
        setLoading(true);
        const response = await axios.get('/banners/listar');
        setBanners(response.data);
      } catch (err) {
        setError('Erro ao carregar banners');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  return {
    banners,
    loading,
    error,
  };
}
