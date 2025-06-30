import instance from "@/service/Conexao/conn";

export async function verificaAuth() {
  try {
    const res = await instance.get("/verificar");
    return res.data.usuario;
  } catch {
    return null;
  }
}
