"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppointment } from '@/hooks/useAppointment';
import { AppointmentType } from '@/types/types';

interface DeleteAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentType | null;
  onSuccess?: () => void;
}

export function DeleteAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: DeleteAppointmentModalProps) {
  const { deleteAppointment, loading } = useAppointment();

  const handleDelete = async () => {
    if (!appointment) return;

    const success = await deleteAppointment(appointment.id);
    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this appointment?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the appointment for{' '}
            <strong>{appointment?.user?.name}</strong> on{' '}
            <strong>{appointment?.appointment_date}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}