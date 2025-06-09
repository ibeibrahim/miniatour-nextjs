"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhotoUpload } from "@/components/ui/photo_upload";
import { useUserUpdateForm } from "@/hooks/useUserUpdateForm";
import { CityType, UpdateUserData, UserType } from "@/types/types";
import { useUsers } from "@/hooks/useUsers";
import { useForm } from "react-hook-form";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCities } from "@/hooks/useCities";
import { useEffect, useState } from "react";

interface UserTourguideUpdateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onSuccess?: (user: UserType) => void;
}

export function UserTourguideUpdateFormModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserTourguideUpdateFormModalProps) {
  const { updateUser, loading: loadingUser } = useUsers();
  const { getCities, loading: loadingCity } = useCities();
  const [cities, setCities] = useState<CityType[] | []>([]);
  const loading = loadingUser || loadingCity;
  const form = useForm();

  const handleSubmit = async (formData: UpdateUserData) => {
    console.log(formData);
    const result = await updateUser(user.id, formData);
    if (result) {
      onSuccess?.(result);
      onClose();
    }
    return result;
  };

  const {
    formData,
    photoPreview,
    errors,
    handleSubmit: onSubmit,
    updateField,
    removePhoto,
    resetForm,
  } = useUserUpdateForm({
    initialData: user,
    onSubmit: handleSubmit,
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };
  useEffect(() => {
    const fetchCities = async () => {
      const data = await getCities();
      setCities(data);
    };
    fetchCities();
  }, [getCities]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>{"Edit User Tourguide"}</DialogTitle>
              <DialogDescription>
                {"Make changes to the user details below."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Photo Upload */}
              <PhotoUpload
                preview={photoPreview}
                onFileSelect={(file) => updateField("photo_profile", file)}
                onRemove={removePhoto}
                error={errors.photo_profile}
                disabled={loading}
              />

              {/* Name Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter user name"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Description Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="description">Description</FormLabel>
                <Input
                  id="description"
                  value={formData.description ?? ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Enter user description"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Price Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="price">Price</FormLabel>
                <Input
                  id="price"
                  value={formData.price ?? ""}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="Enter user price"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              {/* Active Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="is_active">Active</FormLabel>
                <Switch
                  id="is_active"
                  checked={formData.is_active === 1 ? true : false}
                  onCheckedChange={(checked) =>
                    updateField("is_active", checked ? 1 : 0)
                  }
                  disabled={loading}
                />
                {errors.is_active && (
                  <p className="text-sm text-red-500">{errors.is_active}</p>
                )}
              </div>

              {/* City Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="city">City</FormLabel>
                <Select
                  value={formData.city_id ?? ""}
                  onValueChange={(value) => updateField("city_id", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city, key) => (
                      <SelectItem key={key} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
