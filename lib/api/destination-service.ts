import { CreateDestinationData, DestinationType, UpdateDestinationData } from "@/types/types";
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

export const destinationService = {
    async getDestinations(): Promise<DestinationType[]> {
        const response = await api.get("/destinations");
        return response.data['destinations'];
    },

    async createDestination(data: CreateDestinationData): Promise<DestinationType> {
        const response = await api.post("/destinations", data);
        return response.data['destination'];
    },

    async updateDestination(id: number, data: UpdateDestinationData): Promise<DestinationType> {
        const response = await api.patch(`/destinations/${id}`, data);
        return response.data['destination'];
    },

    async deleteDestination(id: number): Promise<boolean> {
        const response = await api.delete(`/destinations/${id}`);
        return response.data['success'];
    }
}