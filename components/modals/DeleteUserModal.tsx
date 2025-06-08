
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
import { UserType } from '@/types/types';
import { useUsers } from '@/hooks/useUsers';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onSuccess?: () => void;
}

export function DeleteUserModal({ isOpen, onClose, user, onSuccess }: DeleteUserModalProps) {
  const { deleteUser, loading } = useUsers();

  const handleDelete = async () => {
    if (!user) return;

    const success = await deleteUser(user.id);
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
            This action cannot be undone. This will permanently delete the user{' '}
            <strong>{user?.name}</strong> and remove their data from the system.
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