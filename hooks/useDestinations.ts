import { destinationService } from "@/lib/api/destination-service";
import {
  CreateDestinationData,
  DestinationType,
  UpdateDestinationData,
} from "@/types/types";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseDestinationsReturn {
  loading: boolean;
  error: string | null;
  getDestinations: () => Promise<DestinationType[] | []>;
  createDestination: (
    data: CreateDestinationData
  ) => Promise<DestinationType | null>;
  updateDestination: (
    id: number,
    data: UpdateDestinationData
  ) => Promise<DestinationType | null>;
  deleteDestination: (id: number) => Promise<boolean>;
}

export function useDestinations(): UseDestinationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDestinations = useCallback(async (): Promise<
    DestinationType[] | []
  > => {
    try {
      setLoading(true);
      setError(null);
      const allDestinations = await destinationService.getDestinations();
      toast.success("Successfully fetched all destinations");
      return allDestinations;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message || "Failed to fetch destinations data";
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

  const createDestination = useCallback(
    async (data: CreateDestinationData): Promise<DestinationType | null> => {
      try {
        setLoading(true);
        setError(null);
        const newDest = await destinationService.createDestination(data);
        toast.success("Destination created successfully");
        return newDest;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage =
            err.response.data.message || "Failed to create destination data";
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

  const updateDestination = useCallback(
    async (
      id: number,
      data: UpdateDestinationData
    ): Promise<DestinationType | null> => {
      try {
        setLoading(true);
        setError(null);
        const updated = await destinationService.updateDestination(id, data);
        toast.success("Destination data updated successfully");
        return updated;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage =
            err.response.data.message || "Failed to update destination data";
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

  const deleteDestination = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        const success = await destinationService.deleteDestination(id);
        toast.success("Destination deleted successfully");
        return success;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage =
            err.response.data.message || "Failed to delete destination data";
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
    },
    []
  );

  return {
    loading,
    error,
    getDestinations,
    createDestination,
    updateDestination,
    deleteDestination,
  };
}
