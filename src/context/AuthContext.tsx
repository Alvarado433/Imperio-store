'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import instance from "@/service/Conexao/conn";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  nivel_id: number;
  // outros campos que usar
}

interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (user: Usuario | null) => void;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const res = await instance.get("/verificar");
      setUsuario(res.data.usuario ?? null);
    } catch {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUsuario();
  }, [refreshUsuario]);

  const logout = useCallback(async () => {
    try {
      await instance.post("/autenticar/logout");
      setUsuario(null);
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, loading, logout, refreshUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}
