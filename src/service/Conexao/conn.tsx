import axios from "axios";

const instance = axios.create({
  baseURL: "https://web-production-c99b.up.railway.app", // link do backend no Railway
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // garante que cookies (como o HttpOnly de autenticação) sejam enviados
});

export default instance;
