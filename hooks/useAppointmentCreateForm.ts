import { AppointmentType, CreateAppointmentData } from "@/types/types";
import { useState } from "react";

interface UseAppointmentCreateFormProps {
  onSubmit: (data: CreateAppointmentData) => Promise<AppointmentType | null>;
  onSuccess?: () => void;
}

export function useAppointmentCreateForm({
  onSuccess,
  onSubmit,
}: UseAppointmentCreateFormProps) {
  const [data, setData] = useState<CreateAppointmentData>({
    tourguide_id: 0,
    user_id: 0,
    destination_id: 0,
    appointment_date: "",
    start_time: "",
    end_time: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (data.tourguide_id === 0) {
      newErrors.tourguide_id = "Tour guide is required";
    }
    if (data.user_id === 0) {
      newErrors.user_id = "User is required";
    }
    if (data.destination_id === 0) {
      newErrors.destination_id = "Destination is required";
    }
    if (!data.appointment_date.trim()) {
      newErrors.appointment_date = "Appointment date is required";
    }
    if (!data.start_time.trim()) {
      newErrors.start_time = "Start time is required";
    }
    if (!data.end_time.trim()) {
      newErrors.end_time = "End time is required";
    }
    if (data.start_time >= data.end_time) {
      newErrors.end_time = "End time must be after start time";
    }
    if (!data.status.trim()) {
      newErrors.status = "Status is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const result = await onSubmit(data);
      if (result) {
        onSuccess?.();
        resetForm();
      }
      return result;
    } catch (error) {
      console.error("Error creating appointment:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof CreateAppointmentData, value: string | number) => {
    setData((prevData) => ({ ...prevData, [field]: value }));
  };

  const resetForm = () => {
    setData({
    tourguide_id: 0,
    user_id: 0,
    destination_id: 0,
    appointment_date: "",
    start_time: "",
    end_time: "",
    status: "pending",
    });
    setErrors({});
  };

  return {
    data,
    errors,
    loading,
    handleSubmit,
    updateField,
    resetForm,
  };
}
