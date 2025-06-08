import { useCallback, useState } from "react";
import { userService } from "@/lib/api/users";
import { toast } from "sonner"; // or your preferred toast library
import { CreateUserData, UpdateUserData, UserType } from "@/types/types";
import axios from "axios";

interface UseUsersReturn {
  loading: boolean;
  error: string | null;
  createUser: (userData: CreateUserData) => Promise<UserType | null>;
  updateUser: (
    id: number,
    userData: UpdateUserData
  ) => Promise<UserType | null>;
  deleteUser: (id: number) => Promise<boolean>;
}

export function useUsers(): UseUsersReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(
    async (userData: CreateUserData): Promise<UserType | null> => {
      try {
        setLoading(true);
        setError(null);

        const newUser = await userService.createUser(userData);

        toast.success("User created successfully");
        return newUser;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage =
            err.response.data.message || "Failed to fetch user data";
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          setError("An unknown error occurred");
          toast.error("An unknown error occurred");
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateUser = useCallback(
    async (
      id: number,
      userData: UpdateUserData
    ): Promise<UserType | null> => {
      try {
        setLoading(true);
        setError(null);

        const updatedUser = await userService.updateUser(id, userData);

        toast.success("User updated successfully");
        return updatedUser;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage =
            err.response.data.message || "Failed to fetch user data";
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          setError("An unknown error occurred");
          toast.error("An unknown error occurred");
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await userService.deleteUser(id);

      toast.success("User deleted successfully");
      return true;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message || "Failed to fetch user data";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
  };
}
