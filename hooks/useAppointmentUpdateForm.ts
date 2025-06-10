import { AppointmentType, UpdateAppointmentData } from "@/types/types";
import { useState } from "react";

interface UseAppointmentUpdateFormProps {
    initialData: AppointmentType | null;
    onSubmit: (data: UpdateAppointmentData) => Promise<AppointmentType | null>;
    onSuccess?: () => void;
}

export function useAppointmentUpdateForm({
    initialData,
    onSubmit,
    onSuccess,
}: UseAppointmentUpdateFormProps) {
    const [data, setData] = useState<UpdateAppointmentData>({
        tourguide_id: initialData?.tourguide_id || null,
        user_id: initialData?.user_id || null,
        destination_id: initialData?.destination_id || null,
        appointment_date: initialData?.appointment_date || "",
        start_time: initialData?.start_time || "",
        end_time: initialData?.end_time || "",
        status: initialData?.status || "pending",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (data.tourguide_id === null) {
            newErrors.tourguide_id = "Tour guide is required";
        }
        if (data.user_id === null) {
            newErrors.user_id = "User is required";
        }
        if (data.destination_id === null) {
            newErrors.destination_id = "Destination is required";
        }
        if (!data.appointment_date || !data.appointment_date.trim()) {
            newErrors.appointment_date = "Appointment date is required";
        }
        if (!data.start_time || !data.start_time.trim()) {
            newErrors.start_time = "Start time is required";
        }
        if (!data.end_time || !data.end_time.trim()) {
            newErrors.end_time = "End time is required";
        }
        if (
            data.start_time &&
            data.end_time &&
            data.start_time.trim() &&
            data.end_time.trim() &&
            data.start_time >= data.end_time
        ) {
            newErrors.end_time = "End time must be after start time";
        }
        if (!data.status || !data.status.trim()) {
            newErrors.status = "Status is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const updatedAppointment = await onSubmit(data);
            if (updatedAppointment && onSuccess) {
                onSuccess();
            }
            return updatedAppointment;
        } catch (error) {
            console.error("Failed to update appointment:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const resetForm = () => {
        setData({
            tourguide_id: initialData?.tourguide_id || null,
            user_id: initialData?.user_id || null,
            destination_id: initialData?.destination_id || null,
            appointment_date: initialData?.appointment_date || "",
            start_time: initialData?.start_time || "",
            end_time: initialData?.end_time || "",
            status: initialData?.status || "pending",
        });
        setErrors({});
    };

    const updateField = (field: keyof UpdateAppointmentData, value: string | number | null) => {
        setData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
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