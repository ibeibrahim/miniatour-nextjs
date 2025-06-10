"use client";
import { useAppointment } from "@/hooks/useAppointment";
import { useAppointmentCreateForm } from "@/hooks/useAppointmentCreateForm";
import { useDestinations } from "@/hooks/useDestination";
import { useUsers } from "@/hooks/useUsers";
import {
  AppointmentType,
  CreateAppointmentData,
  DestinationType,
  TourguideType,
  UserType,
} from "@/types/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AppointmentCreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (appointment: AppointmentType) => void;
}

export function CreateAppointmentFormModal({
  isOpen,
  onClose,
  onSuccess,
}: AppointmentCreateFormModalProps) {
  const { createAppointment, loading: loadingAppointment } = useAppointment();
  const { getDestinations, loading: loadingDestinations } = useDestinations();
  const { getTravelers, getTourGuides, loading: loadingUsers } = useUsers();
  const [destinations, setDestinations] = useState<DestinationType[] | []>([]);
  const [tourGuides, setTourGuides] = useState<TourguideType[] | []>([]);
  const [travelers, setTravelers] = useState<UserType[] | []>([]);
  const loading = loadingAppointment || loadingDestinations || loadingUsers;
  const form = useForm();

  const handleSubmit = async (data: CreateAppointmentData) => {
    const result = await createAppointment(data);
    if (result) {
      onSuccess?.(result);
      onClose();
    }
    return result;
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      const data = await getDestinations();
      setDestinations(data);
    };
    const fetchTourGuides = async () => {
      const data = await getTourGuides();
      setTourGuides(data);
    };
    const fetchTravelers = async () => {
      const data = await getTravelers();
      setTravelers(data);
    };
    fetchDestinations();
    fetchTourGuides();
    fetchTravelers();
  }, [getDestinations, getTourGuides, getTravelers]);

  const {
    data,
    errors,
    handleSubmit: onSubmit,
    updateField,
    resetForm,
  } = useAppointmentCreateForm({
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
              <DialogTitle>{"Create Appointment"}</DialogTitle>
              <DialogDescription>
                {"Fill in the details to add a new appointment."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Traveler Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="user_id">Traveler</FormLabel>
                <Select
                  value={data.user_id.toString() ?? ""}
                  onValueChange={(value) =>
                    updateField("user_id", Number(value))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Traveler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem disabled value="0">
                      Choose the traveler
                    </SelectItem>
                    {travelers.map((user, key) => (
                      <SelectItem key={key} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.user_id && (
                  <p className="text-sm text-red-500">{errors.user_id}</p>
                )}
              </div>

              {/* Tour Guide Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="tourguide_id">Tour Guide</FormLabel>
                <Select
                  value={data.tourguide_id.toString() ?? ""}
                  onValueChange={(value) =>
                    updateField("tourguide_id", Number(value))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tour Guide" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem disabled value="0">
                      Choose the tour guide
                    </SelectItem>
                    {tourGuides.map((guide, key) => (
                      <SelectItem key={key} value={guide.id.toString()}>
                        {guide.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tourguide_id && (
                  <p className="text-sm text-red-500">{errors.tourguide_id}</p>
                )}
              </div>

              {/* Destination Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="destination_id">Destination</FormLabel>
                <Select
                  value={data.destination_id.toString() ?? ""}
                  onValueChange={(value) =>
                    updateField("destination_id", Number(value))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem disabled value="0">
                      Choose the destination
                    </SelectItem>
                    {destinations.map((destination, key) => (
                      <SelectItem key={key} value={destination.id.toString()}>
                        {destination.destination_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.destination_id && (
                  <p className="text-sm text-red-500">
                    {errors.destination_id}
                  </p>
                )}
              </div>

              {/* Appointment Date Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="appointment_date">
                  Appointment Date
                </FormLabel>
                <Input
                  id="appointment_date"
                  type="date"
                  value={data.appointment_date ?? ""}
                  onChange={(e) =>
                    updateField("appointment_date", e.target.value)
                  }
                  placeholder="Select appointment date"
                  className={errors.appointment_date ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.appointment_date && (
                  <p className="text-sm text-red-500">
                    {errors.appointment_date}
                  </p>
                )}
              </div>

              {/* Start Time Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="start_time">Start Time</FormLabel>
                <Input
                  id="start_time"
                  type="time"
                  value={data.start_time ?? ""}
                  onChange={(e) => updateField("start_time", e.target.value)}
                  placeholder="Select start time"
                  className={errors.start_time ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.start_time && (
                  <p className="text-sm text-red-500">{errors.start_time}</p>
                )}
              </div>

              {/* End Time Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="end_time">End Time</FormLabel>
                <Input
                  id="end_time"
                  type="time"
                  value={data.end_time ?? ""}
                  onChange={(e) => updateField("end_time", e.target.value)}
                  placeholder="Select end time"
                  className={errors.end_time ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.end_time && (
                  <p className="text-sm text-red-500">{errors.end_time}</p>
                )}
              </div>

              {/* Status Field */}
              <div className="grid gap-2">
                <FormLabel htmlFor="status">Status</FormLabel>
                <Select
                  value={data.status ?? ""}
                  onValueChange={(value) => updateField("status", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status}</p>
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
                {loading ? "Loading..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
