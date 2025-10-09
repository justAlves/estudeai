import axios from "axios";

const BACKEND_URL = {
    LOCAL: "http://localhost:3000",
    PRODUCTION: "https://estudeai-api-1039437243117.us-central1.run.app",
}

const URLS = {
    LOCAL: "http://localhost:5173",
    PRODUCTION: "https://estudeai.vercel.app",
}

export const BASE_URL = BACKEND_URL.LOCAL;
export const FRONTEND_URL = URLS.LOCAL;


export const api = axios.create({
  baseURL: BASE_URL,
})