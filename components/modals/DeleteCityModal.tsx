'use client';

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
import { useCities } from '@/hooks/useCities';
import { CityType } from '@/types/types';

interface DeleteCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityType | null;
  onSuccess?: () => void;
}

export function DeleteCityModal({ isOpen, onClose, city, onSuccess }: DeleteCityModalProps) {
  const { deleteCity, loading } = useCities();

  const handleDelete = async () => {
    if (!city) return;

    const success = await deleteCity(city.id);
    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the city{' '}
            <strong>{city?.name}</strong> and remove their data from the system.
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