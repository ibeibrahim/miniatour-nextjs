import { useState } from "react";
import { CreateUserData, UserType } from "@/types/types";

interface UseUserFormProps {
  onSubmit: (data: CreateUserData) => Promise<UserType | null>;
  onSuccess?: () => void;
}

export function useUserCreateForm({ onSubmit, onSuccess }: UseUserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role_id: "3",
    photo_profile: null as File | null,
    password: "",
    password_confirmation: "",
    description: null as string | null,
    price: null as string | null,
    city_id: null as string | null,
    is_active: null as number | null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!formData.password_confirmation.trim()) {
      newErrors.password_confirmation = "Password confirmation is required";
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Password and Password Confirmation must be match";
    }

    // Validate photo file size (5MB = 5120KB)
    if (formData.photo_profile && formData.photo_profile.size > 5120 * 1024) {
      newErrors.photo_profile = "Photo size must be less than 5MB";
    }

    // Validate photo file type
    if (formData.photo_profile) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(formData.photo_profile.type)) {
        newErrors.photo_profile =
          "Please select a valid image file (JPEG, PNG, GIF, WebP)";
      }
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

  const updateField = (
    field: keyof typeof formData,
    value: string | number | File | null
  ) => {
    if (field === "photo_profile" && value instanceof File) {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(value);
      setPhotoPreview(previewUrl);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear error when user makes changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo_profile: null }));
    setPhotoPreview(null);

    // Clear photo errors
    if (errors.photo_profile) {
      setErrors((prev) => ({ ...prev, photo_profile: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role_id: "3",
      photo_profile: null,
      password: "",
      password_confirmation: "",
      description: null,
      price: null,
      is_active: null,
      city_id: null,
    });
    setPhotoPreview(null);
    setErrors({});
  };

  return {
    formData,
    photoPreview,
    loading,
    errors,
    handleSubmit,
    updateField,
    removePhoto,
    resetForm,
  };
}
