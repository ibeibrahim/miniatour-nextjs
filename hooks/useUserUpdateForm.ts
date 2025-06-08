import { useState } from 'react';
import { UpdateUserData, UserType } from '@/types/types';

interface UseUserUpdateFormProps {
  initialData: UserType | null;
  onSubmit: (data: UpdateUserData) => Promise<UserType | null>;
  onSuccess?: () => void;
}

export function useUserUpdateForm({ initialData, onSubmit, onSuccess }: UseUserUpdateFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    role_id: initialData?.role_id.toString() || '3',
    photo_profile: null as File | null,
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photo_url || null
  );
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate photo file size (5MB = 5120KB)
    if (formData.photo_profile && formData.photo_profile.size > 5120 * 1024) {
      newErrors.photo_profile = 'Photo size must be less than 5MB';
    }

    // Validate photo file type
    if (formData.photo_profile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(formData.photo_profile.type)) {
        newErrors.photo_profile = 'Please select a valid image file (JPEG, PNG, GIF, WebP)';
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
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    field: keyof typeof formData,
    value: string | File | null
  ) => {
    if (field === 'photo_profile' && value instanceof File) {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(value);
      setPhotoPreview(previewUrl);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user makes changes
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo_profile: null }));
    setPhotoPreview(initialData?.photo_url || null);
    
    // Clear photo errors
    if (errors.photo_profile) {
      setErrors(prev => ({ ...prev, photo_profile: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: initialData?.name || '',
      email: initialData?.email || '',
      role_id: initialData?.role_id.toString() || '3',
      photo_profile: null,
    });
    setPhotoPreview(initialData?.photo_url || null);
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