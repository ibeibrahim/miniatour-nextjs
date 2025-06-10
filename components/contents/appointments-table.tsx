"use client";

import { appointmentService } from "@/lib/api/appointment-service";
import { AppointmentType } from "@/types/types";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, PlusCircle, RefreshCw } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Appointment } from "./appointment";
import { CreateAppointmentFormModal } from "../modals/CreateAppointmentModal";
import { UpdateAppointmentFormModal } from "../modals/UpdateAppointmentModal";
import { DeleteAppointmentModal } from "../modals/DeleteAppointmentModal";

let appointmentsCache: {
  data: AppointmentType[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

export function AppointmentTable() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentType | null>(null);
  const appointmentsPerPage = 10;

  const filteredAppointments = useMemo(() => {
    return appointments;
  }, [appointments]);

  const isCacheValid = () => {
    if (!appointmentsCache) return false;
    const now = Date.now();
    return now - appointmentsCache.timestamp < CACHE_DURATION;
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isCacheValid() && appointmentsCache) {
        setAppointments(appointmentsCache.data);
        setError(null);
        setLoading(false);
        return;
      }
      const data = await appointmentService.getAppointments();
      appointmentsCache = {
        data,
        timestamp: Date.now(),
      };
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch appointments");
      console.error("Error fetching cities:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateAppointment = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditAppointment = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };
  const handleDeleteAppointment = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  const handleAppointmentCreated = (newAppointment: AppointmentType) => {
    setAppointments((prev) => [newAppointment, ...prev]);

    // Update cache
    if (appointmentsCache) {
      appointmentsCache.data = [newAppointment , ...appointmentsCache.data];
    }
  };

  const handleAppointmentUpdated = (updatedAppointment: AppointmentType) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === updatedAppointment.id ? updatedAppointment : appt
      )
    );
    if (appointmentsCache) {
      appointmentsCache.data = appointmentsCache.data.map((appt) =>
        appt.id === updatedAppointment.id ? updatedAppointment : appt
      );
      appointmentsCache.timestamp = Date.now();
    }
  };

  const handleAppointmentDeleted = () => {
    if (selectedAppointment) {
      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== selectedAppointment.id)
      );
      if (appointmentsCache) {
        appointmentsCache.data = appointmentsCache.data.filter(
          (appt) => appt.id !== selectedAppointment.id
        );
        appointmentsCache.timestamp = Date.now();
      }
    }
  };

  const refreshAppointments = () => {
    appointmentsCache = null;
    fetchAppointments();
  };

  const totalAppointments = filteredAppointments.length;
  const totalPages = Math.ceil(totalAppointments / appointmentsPerPage);
  const startIndex = (currentPage - 1) * appointmentsPerPage;
  const endIndex = startIndex + appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

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

  if (loading) {
    return (
      <>
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row items-center justify-between">
            <Button
              size="sm"
              onClick={handleCreateAppointment}
              className="h-8 gap-1"
              variant="outline"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Tambah Appointment
              </span>
            </Button>
            <Button
              onClick={refreshAppointments}
              variant="outline"
              className="size-8"
              size="icon"
            >
              <RefreshCw />
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex flex-row gap-x-2 items-center">
                  <h1>Appointment</h1>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-white"
                  >
                    0 appointment
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>Loading appointment...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-32">
                <div className="text-muted-foreground">Loading...</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row items-center justify-between">
            <Button
              size="sm"
              onClick={handleCreateAppointment}
              className="h-8 gap-1"
              variant="outline"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Tambah Appointment
              </span>
            </Button>
            <Button
              onClick={refreshAppointments}
              variant="outline"
              className="size-8"
              size="icon"
            >
              <RefreshCw />
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex flex-row gap-x-2 items-center">
                  <h1>Appointment</h1>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-white"
                  >
                    0 appointment
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>Error loading appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center items-center h-32 gap-2">
                <div className="text-red-500">{error}</div>
                <Button
                  onClick={refreshAppointments}
                  variant="outline"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row items-center justify-between">
          <Button
            size="sm"
            onClick={handleCreateAppointment}
            className="h-8 gap-1"
            variant="outline"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Tambah Appointment
            </span>
          </Button>
          <Button
            onClick={refreshAppointments}
            variant="outline"
            className="size-8"
            size="icon"
          >
            <RefreshCw />
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex flex-row gap-x-2 items-center">
                <h1>Appointment</h1>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-white"
                >
                  {totalAppointments} Appointment
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Manage appointments in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={1}>ID</TableHead>
                  <TableHead colSpan={3}>User</TableHead>
                  <TableHead colSpan={1}>Tour Guide</TableHead>
                  <TableHead colSpan={1}>Destination</TableHead>
                  <TableHead colSpan={1}>Date</TableHead>
                  <TableHead colSpan={1}>Status</TableHead>
                  <TableHead colSpan={1}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAppointments.length > 0 ? (
                  currentAppointments.map((appt) => (
                    <Appointment
                      key={appt.id}
                      appointment={appt}
                      onEdit={() => handleEditAppointment(appt)}
                      onDelete={() => handleDeleteAppointment(appt)}
                    />
                  ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No appointments found
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
                  {totalAppointments > 0 ? startIndex + 1 : 0}-
                  {Math.min(endIndex, totalAppointments)}
                </strong>{" "}
                of <strong>{totalAppointments}</strong> appointments
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
                  disabled={
                    currentPage === totalPages || totalAppointments === 0
                  }
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
        {/* Create Appointment Modal */}
        {isCreateModalOpen && (
          <CreateAppointmentFormModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleAppointmentCreated}
          />
        )}

        {/* Update User Modal */}
        {isEditModalOpen && selectedAppointment && (
          <UpdateAppointmentFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            appointment={selectedAppointment}
            onSuccess={handleAppointmentUpdated}
          />
        )}

        {/* Delete User Modal */}
        {isDeleteModalOpen && selectedAppointment && (
          <DeleteAppointmentModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            appointment={selectedAppointment}
            onSuccess={handleAppointmentDeleted}
          />
        )}
      </div>
    </>
  );
}
