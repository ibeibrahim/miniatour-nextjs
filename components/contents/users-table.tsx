"use client";

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, PlusCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/types";
import { User } from "./users";
import { useState, useEffect, useMemo } from "react";
import { UserUpdateFormModal } from "../modals/UpdateUserModal";
import { DeleteUserModal } from "../modals/DeleteUserModal";
import { UserCreateFormModal } from "../modals/CreateUserModal";
import { userService } from "@/lib/api/users";
import { UserTourguideUpdateFormModal } from "../modals/UpdateUserTourguideModal";

interface UsersTableProps {
  userRole: "traveler" | "tourguide";
}

let usersCache: {
  data: UserType[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

export function UsersTable({ userRole }: UsersTableProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const usersPerPage = 5;

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) => user.role_id === (userRole === "traveler" ? 3 : 2)
    );
  }, [users, userRole]);

  useEffect(() => {
    setCurrentPage(1);
  }, [userRole]);

  const isCacheValid = () => {
    if (!usersCache) return false;
    const now = Date.now();
    return now - usersCache.timestamp < CACHE_DURATION;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Check if we have valid cached data
      if (isCacheValid() && usersCache) {
        setUsers(usersCache.data);
        setError(null);
        setLoading(false);
        return;
      }

      // Fetch from API if no valid cache
      const userData = await userService.getUsers();

      // Update cache
      usersCache = {
        data: userData,
        timestamp: Date.now(),
      };

      setUsers(userData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUserCreated = (newUser: UserType) => {
    setUsers((prev) => [...prev, newUser]);

    // Update cache
    if (usersCache) {
      usersCache.data = [...usersCache.data, newUser];
    }
  };

  const handleUserUpdated = (updatedUser: UserType) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );

    // Update cache
    if (usersCache) {
      usersCache.data = usersCache.data.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
    }
  };

  const handleUserDeleted = () => {
    if (selectedUser) {
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));

      // Update cache
      if (usersCache) {
        usersCache.data = usersCache.data.filter(
          (user) => user.id !== selectedUser.id
        );
      }
    }
  };

  const refreshUsers = () => {
    usersCache = null;
    fetchUsers();
  };

  // Calculate pagination values
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getTitle = () => {
    return userRole === "traveler" ? "Travelers" : "Tour Guides";
  };

  const getDescription = () => {
    return userRole === "traveler"
      ? "Manage travelers in your system."
      : "Manage tour guides in your system.";
  };
  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>Error loading users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-center items-center h-32 gap-2">
            <div className="text-red-500">{error}</div>
            <Button onClick={refreshUsers} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-row items-start justify-between">
            <div className="gap-y-2 flex flex-col">
              <CardTitle>{getTitle()}</CardTitle>
              <CardDescription>{getDescription()}</CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleCreateUser}
                className="h-8 gap-1"
                variant="outline"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add User
                </span>
              </Button>
              <Button
                onClick={refreshUsers}
                variant="outline"
                className="size-8"
                size="icon"
              >
                <RefreshCw />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>
                  {userRole === "traveler" ? "Notification" : "Active"}
                </TableHead>
                <TableHead>Email</TableHead>
                {userRole === "tourguide" && (
                  <>
                    <TableHead>Price</TableHead>
                  </>
                )}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <User
                    key={user.id}
                    user={user}
                    onEdit={() => handleEditUser(user)}
                    onDelete={() => handleDeleteUser(user)}
                  />
                ))
              ) : (
                <TableRow>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="flex items-center w-full justify-between">
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <strong>
                {totalUsers > 0 ? startIndex + 1 : 0}-
                {Math.min(endIndex, totalUsers)}
              </strong>{" "}
              of <strong>{totalUsers}</strong> users
            </div>
            <div className="flex">
              <Button
                onClick={goToPrevPage}
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Button>
              <Button
                onClick={goToNextPage}
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages || totalUsers === 0}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      {isCreateModalOpen && (
        <UserCreateFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleUserCreated}
        />
      )}

      {/* Update User Modal */}
      {isEditModalOpen && selectedUser && selectedUser.role_id === 3 && (
        <UserUpdateFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
          onSuccess={handleUserUpdated}
        />
      )}

      {/* Update User Tourguide Modal */}
      {isEditModalOpen && selectedUser && selectedUser.role_id === 2 && (
        <UserTourguideUpdateFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
          onSuccess={handleUserUpdated}
        />
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && selectedUser && (
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          user={selectedUser}
          onSuccess={handleUserDeleted}
        />
      )}
    </>
  );
}
