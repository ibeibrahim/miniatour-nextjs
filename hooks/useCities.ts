"use client";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { CityType, CreateCityData, UpdateCityData } from "@/types/types";
import { cityService } from "@/lib/api/city-service";

interface UseCitiesReturn {
  loading: boolean;
  error: string | null;
  getCities: () => Promise<CityType[]>;
  createCity: (data: CreateCityData) => Promise<CityType | null>;
  updateCity: (id: number, data: UpdateCityData) => Promise<CityType | null>;
  deleteCity: (id: number) => Promise<boolean>;
}

export function useCities(): UseCitiesReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCities = useCallback(async (): Promise<CityType[]> => {
    try {
      setLoading(true);
      setError(null);
      const allCities = await cityService.getCities();
      toast.success("Successfully fetched all cities");
      return allCities;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message || "Failed to fetch cities data";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  const createCity = useCallback(
    async (data: CreateCityData): Promise<CityType | null> => {
      try {
        setLoading(true);
        setError(null);
        const newCity = await cityService.createCity(data);
        toast.success("City created successfully");
        return newCity;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage =
            err.response.data.message || "Failed to create a new city";
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          setError("An unknown error occurred");
          toast.error("An unknown error occurred");
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const updateCity = useCallback(
    async (id: number, data: UpdateCityData): Promise<CityType | null> => {
      try {
        setLoading(true);
        setError(null);
        const newCity = await cityService.updateCity(id, data);
        toast.success("City updated successfully");
        return newCity;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage =
            err.response.data.message || "Failed to update city data";
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          setError("An unknown error occurred");
          toast.error("An unknown error occurred");
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const deleteCity = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const newCity = await cityService.deleteCity(id);
      toast.success("City deleted successfully");
      return newCity;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message || "Failed to update city data";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    error,
    getCities,
    createCity,
    updateCity,
    deleteCity,
  };
}
