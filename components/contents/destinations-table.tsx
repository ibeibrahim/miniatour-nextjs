"use client";
import { DestinationType } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, PlusCircle, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { destinationService } from "@/lib/api/destination-service";
import { Destination } from "./destination";
import { DestinationCreateFormModal } from "../modals/CreateDestinationModal";
import { DeleteDestinationModal } from "../modals/DeleteDestinationModal";
import { DestinationUpdateFormModal } from "../modals/UpdateDestinationModal";

let destinationsCache: {
  data: DestinationType[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

export function DestinationsTable() {
  const [destinations, setDestinations] = useState<DestinationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationType | null>(null);
  const destinationsPerPage = 5;

  const filteredDestinations = useMemo(() => {
    return destinations;
  }, [destinations]);

  const isCacheValid = () => {
    if (!destinationsCache) return false;
    const now = Date.now();
    return now - destinationsCache.timestamp < CACHE_DURATION;
  };

  const fetchDestinations = async () => {
    try {
      setLoading(true);

      // Check if we have valid cached data
      if (isCacheValid() && destinationsCache) {
        setDestinations(destinationsCache.data);
        setError(null);
        setLoading(false);
        return;
      }

      // Fetch from API if no valid cache
      const data = await destinationService.getDestinations();

      // Update cache
      destinationsCache = {
        data: data,
        timestamp: Date.now(),
      };

      setDestinations(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch destinations");
      console.error("Error fetching destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleCreateDestination = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditDestination = (dest: DestinationType) => {
    setSelectedDestination(dest);
    setIsEditModalOpen(true);
  };

  const handleDeleteDestination = (dest: DestinationType) => {
    setSelectedDestination(dest);
    setIsDeleteModalOpen(true);
  };

  const handleDestinationCreated = (newDest: DestinationType) => {
    setDestinations((prev) => [...prev, newDest]);

    // Update cache
    if (destinationsCache) {
      destinationsCache.data = [...destinationsCache.data, newDest];
    }
  };

  const handleDestinationUpdated = (updatedDest: DestinationType) => {
    setDestinations((prev) =>
      prev.map((dest) => (dest.id === updatedDest.id ? updatedDest : dest))
    );

    // Update cache
    if (destinationsCache) {
      destinationsCache.data = destinationsCache.data.map((dest) =>
        dest.id === updatedDest.id ? updatedDest : dest
      );
    }
  };

  const handleDestinationDeleted = () => {
    if (selectedDestination) {
      setDestinations((prev) =>
        prev.filter((dest) => dest.id !== selectedDestination.id)
      );

      // Update cache
      if (destinationsCache) {
        destinationsCache.data = destinationsCache.data.filter(
          (dest) => dest.id !== selectedDestination.id
        );
      }
    }
  };

  const refreshDestinations = () => {
    destinationsCache = null;
    fetchDestinations();
  };

  // Calculate pagination values
  const totalDestinations = filteredDestinations.length;
  const totalPages = Math.ceil(totalDestinations / destinationsPerPage);
  const startIndex = (currentPage - 1) * destinationsPerPage;
  const endIndex = startIndex + destinationsPerPage;
  const currentDestinations = filteredDestinations.slice(startIndex, endIndex);

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
              onClick={handleCreateDestination}
              className="h-8 gap-1"
              variant="outline"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Destination
              </span>
            </Button>
            <Button
              onClick={refreshDestinations}
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
                  <h1>Destination</h1>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-white"
                  >
                    0 Destination
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>Loading destinations...</CardDescription>
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
              onClick={handleCreateDestination}
              className="h-8 gap-1"
              variant="outline"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Destination
              </span>
            </Button>
            <Button
              onClick={refreshDestinations}
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
                  <h1>Destination</h1>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-white"
                  >
                    0 Destination
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>Error loading destinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center items-center h-32 gap-2">
                <div className="text-red-500">{error}</div>
                <Button
                  onClick={refreshDestinations}
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
            onClick={handleCreateDestination}
            className="h-8 gap-1"
            variant="outline"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Destination
            </span>
          </Button>
          <Button
            onClick={refreshDestinations}
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
                <h1>Destination</h1>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-white"
                >
                  {totalDestinations} Destination
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Manage destinations in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={2}>Name</TableHead>
                  <TableHead colSpan={1}>City</TableHead>
                  <TableHead colSpan={1}>Address</TableHead>
                  <TableHead colSpan={1}>Entry Fee</TableHead>
                  <TableHead colSpan={1}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDestinations.length > 0 ? (
                  currentDestinations.map((dest) => (
                    <Destination
                      key={dest.id}
                      destination={dest}
                      onEdit={() => handleEditDestination(dest)}
                      onDelete={() => handleDeleteDestination(dest)}
                    />
                  ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No destinations found
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
                  {totalDestinations > 0 ? startIndex + 1 : 0}-
                  {Math.min(endIndex, totalDestinations)}
                </strong>{" "}
                of <strong>{totalDestinations}</strong> destinations
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
                    currentPage === totalPages || totalDestinations === 0
                  }
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
        {/* Create Destination Modal */}
        {isCreateModalOpen && (
          <DestinationCreateFormModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleDestinationCreated}
          />
        )}

        {/* Update User Modal */}
        {isEditModalOpen && selectedDestination && (
          <DestinationUpdateFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            dest={selectedDestination}
            onSuccess={handleDestinationUpdated}
          />
        )}

        {/* Delete User Modal */}
        {isDeleteModalOpen && selectedDestination && (
          <DeleteDestinationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            dest={selectedDestination}
            onSuccess={handleDestinationDeleted}
          />
        )}
      </div>
    </>
  );
}
