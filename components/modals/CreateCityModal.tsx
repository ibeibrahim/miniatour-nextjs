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
import { useCities } from "@/hooks/useCities";
import { useCityCreateForm } from "@/hooks/useCityCreateForm";
import { CityType, CreateCityData } from "@/types/types";
import { useForm } from "react-hook-form";

interface CityCreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (city: CityType) => void;
}

export function CityCreateFormModal({
  isOpen,
  onClose,
  onSuccess,
}: CityCreateFormModalProps) {
  const { createCity, loading } = useCities();
  const form = useForm();
  const handleSubmit = async (formData: CreateCityData) => {
    const result = await createCity(formData);
    if (result) {
      onSuccess?.(result);
      onClose();
    }
    return result;
  };
  const {
    formData,
    errors,
    handleSubmit: onSubmit,
    updateField,
    resetForm,
  } = useCityCreateForm({
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
              <DialogTitle>{"Create City"}</DialogTitle>
              <DialogDescription>
                {"Fill in the details to create a new city."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Name Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter city name"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
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
                {loading ? "Saving..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
