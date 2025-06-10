import { appointmentService } from "@/lib/api/appointment-service";
import {
  AppointmentType,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "@/types/types";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseAppointmentReturn {
  loading: boolean;
  error: string | null;
  getAppointments: () => Promise<AppointmentType[] | []>;
  createAppointment: (
    data: CreateAppointmentData
  ) => Promise<AppointmentType | null>;
  updateAppointment: (
    id: number,
    data: UpdateAppointmentData
  ) => Promise<AppointmentType | null>;
  deleteAppointment: (id: number) => Promise<boolean>;
}

export function useAppointment(): UseAppointmentReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAppointments = useCallback(async (): Promise<
    AppointmentType[] | []
  > => {
    try {
      setLoading(true);
      setError(null);
      const allAppointments = await appointmentService.getAppointments();
      toast.success("Successfully fetched all appointments");
      return allAppointments;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message || "Failed to fetch appointments data";
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

  const createAppointment = useCallback(
    async (data: CreateAppointmentData): Promise<AppointmentType | null> => {
      try {
        setLoading(true);
        setError(null);
        const newAppointment = await appointmentService.createAppointment(data);
        toast.success("Appointment created successfully");
        return newAppointment;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage =
            err.response.data.message || "Failed to create appointment";
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

  const updateAppointment = useCallback(
    async (
      id: number,
      data: UpdateAppointmentData
    ): Promise<AppointmentType | null> => {
      try {
        setLoading(true);
        setError(null);
        const updatedAppointment = await appointmentService.updateAppointment(
          id,
          data
        );
        toast.success("Appointment updated successfully");
        return updatedAppointment;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage =
            err.response.data.message || "Failed to update appointment";
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

    const deleteAppointment = useCallback(
        async (id: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const success = await appointmentService.deleteAppointment(id);
            toast.success("Appointment deleted successfully");
            return success;
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
            const errorMessage =
                err.response.data.message || "Failed to delete appointment";
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
        getAppointments,
        createAppointment,
        updateAppointment,
        deleteAppointment,
    }
}
