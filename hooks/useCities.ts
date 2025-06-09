import { useCallback, useState } from "react";
import { toast } from "sonner"; // or your preferred toast library
import axios from "axios";
import { City } from "@/types/types";
import { cityService } from "@/lib/api/cities";

interface UseCitiesReturn {
  loading: boolean;
  error: string | null;
  getCities: () => Promise<City[]>;
}

export function useCities(): UseCitiesReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCities = useCallback(async (): Promise<City[]> => {
    console.log('get cities');
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
  return {
    loading,
    error,
    getCities,
  }
}
