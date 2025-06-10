import {
  AppointmentType,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "@/types/types";
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

export const appointmentService = {
  async getAppointments(): Promise<AppointmentType[]> {
    const response = await api.get("/appointments");
    return response.data["data"];
  },

  async createAppointment(
    data: CreateAppointmentData
  ): Promise<AppointmentType> {
    const response = await api.post("/appointments", data);
    return response.data["appointment"];
  },

  async updateAppointment(
    id: number,
    data: UpdateAppointmentData
  ): Promise<AppointmentType> {
    // change data of data.stert_time and data.end_time to match format "H:i"
    if (data.start_time) {
      data.start_time = data.start_time.slice(0,5)
    }
    if (data.end_time) {
      data.end_time = data.end_time.slice(0,5)
    }
    const response = await api.patch(`/appointments/${id}`, data);
    return response.data["appointment"];
  },

  async deleteAppointment(id: number): Promise<boolean> {
    const response = await api.delete(`/appointments/${id}`);
    return response.data["success"];
  },
};
