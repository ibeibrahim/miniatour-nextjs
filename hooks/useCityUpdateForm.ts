import { CityType, UpdateCityData } from "@/types/types";
import { useState } from "react";

interface UseCityUpdateFormProps {
  initialData: CityType | null;
  onSubmit: (data: UpdateCityData) => Promise<CityType | null>;
  onSuccess?: () => void;
}

export function useCityUpdateForm({
  initialData,
  onSubmit,
  onSuccess,
}: UseCityUpdateFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
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
      await onSubmit(formData);
      onSuccess?.();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user makes changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: initialData?.name || "",
    });
    setErrors({});
  };
  return {
    formData,
    loading,
    errors,
    handleSubmit,
    updateField,
    resetForm,
  };
}
