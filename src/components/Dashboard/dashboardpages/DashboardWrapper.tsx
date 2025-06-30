"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Dashboard from "./Dashboard";
import { useAuth } from "@/context/AuthContext";

export default function DashboardWrapper() {
  const { usuario, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!usuario) {
        router.push("/Login");
      } else if (usuario.nivel_id !== 2) {
        router.push("/");
      }
    }
  }, [usuario, loading, router]);

  if (loading) {
    return <p>Carregando usuário...</p>;
  }

  if (!usuario || usuario.nivel_id !== 2) {
    return null; // já está redirecionando
  }

  return <Dashboard />;
}
