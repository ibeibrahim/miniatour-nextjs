import { CreateDestinationData, DestinationType } from "@/types/types";
import { useState } from "react";

interface UseDestinationFormProps {
  onSubmit: (data: CreateDestinationData) => Promise<DestinationType | null>;
  onSuccess?: () => void;
}

export function useDestinationForm({
  onSuccess,
  onSubmit,
}: UseDestinationFormProps) {
  const [data, setData] = useState({
    city_id: 0,
    destination_name: "",
    address: "",
    latitude: 0,
    longitude: 0,
    description: "",
    entry_fee: 0,
    operational_hours: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (data.city_id === 0) {
      newErrors.city_id = "City is required";
    }
    if (data.latitude === 0) {
      newErrors.latitude = "Latitude is required";
    }
    if (data.longitude === 0) {
      newErrors.longitude = "Longitude is required";
    }
    if (data.entry_fee === 0) {
      newErrors.entry_fee = "Entry fee is required";
    }
    if (!data.destination_name.trim()) {
      newErrors.destination_name = "Destination name is required";
    }
    if (!data.address.trim()) {
      newErrors.address = "Destination address is required";
    }
    if (!data.operational_hours.trim()) {
      newErrors.operational_hours = "Destination operational hours is required";
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
      await onSubmit(data);
      onSuccess?.();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof data, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setData({
      city_id: 0,
      destination_name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      description: "",
      entry_fee: 0,
      operational_hours: "",
    });
    setErrors({});
  };

  return {
    data,
    loading,
    errors,
    handleSubmit,
    updateField,
    resetForm,
  };
}
