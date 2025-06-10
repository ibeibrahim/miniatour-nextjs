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
import { useDestinations } from '@/hooks/useDestinations';
import { DestinationType } from '@/types/types';

interface DeleteDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dest: DestinationType | null;
  onSuccess?: () => void;
}

export function DeleteDestinationModal({ isOpen, onClose, dest, onSuccess }: DeleteDestinationModalProps) {
  const { deleteDestination, loading } = useDestinations();

  const handleDelete = async () => {
    if (!dest) return;

    const success = await deleteDestination(dest.id);
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
            This action cannot be undone. This will permanently delete the destination{' '}
            <strong>{dest?.destination_name}</strong> and remove the data from the system.
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