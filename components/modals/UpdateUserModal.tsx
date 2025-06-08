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
import { UpdateUserData, UserType } from "@/types/types";
import { useUsers } from "@/hooks/useUsers";
import { useForm } from "react-hook-form";

interface UserUpdateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onSuccess?: (user: UserType) => void;
}

export function UserUpdateFormModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserUpdateFormModalProps) {
  const { updateUser, loading } = useUsers();
  const form = useForm();

  const handleSubmit = async (formData: UpdateUserData) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>{"Edit User"}</DialogTitle>
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
