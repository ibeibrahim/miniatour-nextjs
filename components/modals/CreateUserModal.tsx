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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhotoUpload } from "@/components/ui/photo_upload";
import { City, CreateUserData, UserType } from "@/types/types";
import { useUsers } from "@/hooks/useUsers";
import { useUserCreateForm } from "@/hooks/useUserCreateForm";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "../ui/switch";
import { useCities } from "@/hooks/useCities";

interface UserCreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserType) => void;
}

export function UserCreateFormModal({
  isOpen,
  onClose,
  onSuccess,
}: UserCreateFormModalProps) {
  const { createUser, loading: loadingUser } = useUsers();
  const { getCities, loading: loadingCity } = useCities();
  const [cities, setCities] = useState<City[] | []>([]);
  const loading = loadingUser || loadingCity;
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const form = useForm();
  const handleSubmit = async (formData: CreateUserData) => {
    const result = await createUser(formData);
    if (result) {
      onSuccess?.(result);
      onClose();
    }
    return result;
  };
  useEffect(() => {
    const fetchCities = async () => {
      const data = await getCities();
      setCities(data);
    };
    fetchCities();
  }, [getCities]);

  const {
    formData,
    photoPreview,
    errors,
    handleSubmit: onSubmit,
    updateField,
    removePhoto,
    resetForm,
  } = useUserCreateForm({
    onSubmit: handleSubmit,
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>{"Create User"}</DialogTitle>
              <DialogDescription>
                {"Fill in the details to create a new user."}
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

              {/* Password Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="password">Password</FormLabel>
                <div className="flex w-full items-center justify-between gap-4">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="Enter new password"
                    className={errors.password ? "border-red-500" : ""}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 size-8"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Password Confirmation Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="password_confirmation">
                  Confirm Password
                </FormLabel>
                <div className="flex w-full items-center justify-between gap-4">
                  <Input
                    id="password_confirmation"
                    type={showPasswordConfirmation ? "text" : "password"}
                    value={formData.password_confirmation}
                    onChange={(e) =>
                      updateField("password_confirmation", e.target.value)
                    }
                    placeholder="Confirm your password"
                    className={
                      errors.password_confirmation ? "border-red-500" : ""
                    }
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setShowPasswordConfirmation(!showPasswordConfirmation)
                    }
                    className="text-gray-500 size-8"
                  >
                    {showPasswordConfirmation ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-sm text-red-500">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              {/* Role Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="role">Role</FormLabel>
                <Select
                  value={formData.role_id}
                  onValueChange={(value) => updateField("role_id", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Tourguide</SelectItem>
                    <SelectItem value="3">Traveler</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Data for Tourguide */}
              {formData.role_id === "2" && (
                <>
                  {/* Description Field */}
                  <div className="grid gap-2">
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Input
                      id="description"
                      value={formData.description ?? ""}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      placeholder="Enter user description"
                      className={errors.name ? "border-red-500" : ""}
                      disabled={loading}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
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
                </>
              )}
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
                {loading ? "Saving..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
