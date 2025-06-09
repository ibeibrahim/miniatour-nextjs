import { CityType, CreateCityData, UpdateCityData } from "@/types/types";
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const cityService = {
  async getCities(): Promise<CityType[]> {
    const response = await api.get("/cities");
    return response.data["cities"];
  },

  async getCityById(id: number): Promise<CityType> {
    const response = await api.get(`/cities/${id}`);
    return response.data["city"];
  },

  async createCity(data: CreateCityData): Promise<CityType> {
    const formData = new FormData();
    formData.append("name", data.name);
    const response = await api.post("/cities", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data["city"];
  },

  async updateCity(id: number, data: UpdateCityData): Promise<CityType> {
    const formData = new FormData();
    formData.append("name", data.name);
    const response = await api.post("/cities", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data["city"];
  },

  async deleteCity(id: number): Promise<boolean> {
    const response = await api.delete(`/cities/${id}`);
    return response.data["success"];
  },
};
