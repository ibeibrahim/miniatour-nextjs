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
import { useCities } from "@/hooks/useCities";
import { useDestinations } from "@/hooks/useDestinations";
import {
  CityType,
  DestinationType,
  UpdateDestinationData,
} from "@/types/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDestinationUpdateForm } from "@/hooks/useDestinationUpdateForm";
import { Textarea } from "../ui/textarea";

interface DestinationUpdateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  dest: DestinationType;
  onSuccess?: (destination: DestinationType) => void;
}

export function DestinationUpdateFormModal({
  isOpen,
  onClose,
  dest,
  onSuccess,
}: DestinationUpdateFormModalProps) {
  const { updateDestination, loading: loadingDestination } = useDestinations();
  const { getCities, loading: loadingCity } = useCities();
  const [cities, setCities] = useState<CityType[] | []>([]);
  const loading = loadingDestination || loadingCity;

  const form = useForm();
  const handleSubmit = async (data: UpdateDestinationData) => {
    const result = await updateDestination(dest.id, data);
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
    data,
    errors,
    handleSubmit: onSubmit,
    updateField,
    resetForm,
  } = useDestinationUpdateForm({
    initialData: dest,
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
              <DialogTitle>{"Edit Destination"}</DialogTitle>
              <DialogDescription>
                {"Fill in the details to add a new destination."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* City Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="city">City</FormLabel>
                <Select
                  value={data.city_id.toString() ?? ""}
                  onValueChange={(value) =>
                    updateField("city_id", Number(value))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem disabled value="0">
                      Choose the City
                    </SelectItem>
                    {cities.map((city, key) => (
                      <SelectItem key={key} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Name Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="destination_name">
                  Destination Name
                </FormLabel>
                <Input
                  id="destination_name"
                  value={data.destination_name}
                  onChange={(e) =>
                    updateField("destination_name", e.target.value)
                  }
                  placeholder="Enter destination name"
                  className={errors.destination_name ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.destination_name && (
                  <p className="text-sm text-red-500">
                    {errors.destination_name}
                  </p>
                )}
              </div>

              {/* Address Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="address">Address</FormLabel>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Enter destination address"
                  className={errors.address ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Latitude Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="latitude">Latitude</FormLabel>
                <Input
                  id="latitude"
                  value={data.latitude ?? 0}
                  onChange={(e) => updateField("latitude", e.target.value)}
                  placeholder="Enter destination latitude"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={loading}
                  type="number"
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500">{errors.latitude}</p>
                )}
              </div>

              {/* Longitude Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="longitude">Longitude</FormLabel>
                <Input
                  id="longitude"
                  value={data.longitude ?? 0}
                  onChange={(e) => updateField("longitude", e.target.value)}
                  placeholder="Enter destination longitude"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={loading}
                  type="number"
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500">{errors.longitude}</p>
                )}
              </div>

              {/* Description Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  id="description"
                  value={data.description ?? ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Enter destination description"
                  className={errors.description ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Entry Fee Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="entry_fee">Entry Fee</FormLabel>
                <Input
                  id="entry_fee"
                  value={data.entry_fee ?? 0}
                  onChange={(e) => updateField("entry_fee", e.target.value)}
                  placeholder="Enter destination entry fee"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={loading}
                  type="number"
                />
                {errors.entry_fee && (
                  <p className="text-sm text-red-500">{errors.entry_fee}</p>
                )}
              </div>

              {/* Operatinal Hour Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="operational_hours">
                  Operatinal Hour
                </FormLabel>
                <Input
                  id="operational_hours"
                  value={data.operational_hours ?? ""}
                  onChange={(e) =>
                    updateField("operational_hours", e.target.value)
                  }
                  placeholder="Enter destination operational hours"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.operational_hours && (
                  <p className="text-sm text-red-500">
                    {errors.operational_hours}
                  </p>
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
                {loading
                  ? loadingCity && !loadingDestination
                    ? "Loading..."
                    : !loadingCity && loadingDestination
                    ? "Saving..."
                    : "Loading..."
                  : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
