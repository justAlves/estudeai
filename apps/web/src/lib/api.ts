import axios from "axios";

const URL = {
    LOCAL: "http://localhost:3000",
    PRODUCTION: "https://estudeai-api-1039437243117.us-central1.run.app",
}

export const BASE_URL = URL.PRODUCTION;

export const api = axios.create({
  baseURL: BASE_URL,
})