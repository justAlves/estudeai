import axios from "axios";

const BACKEND_URL = {
    LOCAL: "http://localhost:3000",
    PRODUCTION: "https://api.estudyai.com.br",
}

const URLS = {
    LOCAL: "http://localhost:5173",
    PRODUCTION: "https://estudyai.com.br",
}

export const BASE_URL = BACKEND_URL.PRODUCTION;
export const FRONTEND_URL = URLS.PRODUCTION;


export const api = axios.create({
  baseURL: BASE_URL,
})