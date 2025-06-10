import { useCallback, useState } from "react";
import { userService } from "@/lib/api/users";
import { toast } from "sonner"; // or your preferred toast library
import { CreateUserData, TourguideType, UpdateUserData, UserType } from "@/types/types";
import axios from "axios";

interface UseUsersReturn {
  loading: boolean;
  error: string | null;
  getUsers: () => Promise<UserType[] | []>;
  getTravelers: () => Promise<UserType[] | []>;
  getTourGuides: () => Promise<TourguideType[] | []>;
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

  const getUsers = useCallback(async (): Promise<UserType[] | []> => {
    try {
      setLoading(true);
      setError(null);
      const allUsers = await userService.getUsers();
      toast.success("Successfully fetched all users");
      return allUsers;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message || "Failed to fetch users data";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [])

  const getTravelers = useCallback(async (): Promise<UserType[] | []> => {
    try {
      setLoading(true);
      setError(null);
      let travelers = await userService.getUsers();
      travelers = travelers.filter((user) => user.role_id === 3);
      toast.success("Successfully fetched all travelers");
      return travelers;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message || "Failed to fetch travelers data";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getTourGuides = useCallback(async (): Promise<TourguideType[] | []> => {
    try {
      setLoading(true);
      setError(null);
      const tourGuides = await userService.getTourGuides();
      toast.success("Successfully fetched all tour guides");
      return tourGuides;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message || "Failed to fetch tour guides data";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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
    getUsers,
    getTourGuides,
    getTravelers,
    createUser,
    updateUser,
    deleteUser,
  };
}
