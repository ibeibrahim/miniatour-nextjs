"use client";
import { CityType } from "@/types/types";
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
import { cityService } from "@/lib/api/city-service";
import { City } from "./cities";
import { CityCreateFormModal } from "../modals/CreateCityModal";
import { CityUpdateFormModal } from "../modals/UpdateCityModal";
import { DeleteCityModal } from "../modals/DeleteCityModal";

let citiesCache: {
  data: CityType[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

export function CitiesTable() {
  const [cities, setCities] = useState<CityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityType | null>(null);
  const citiesPerPage = 5;

  const filteredCities = useMemo(() => {
    return cities;
  }, [cities]);

  const isCacheValid = () => {
    if (!citiesCache) return false;
    const now = Date.now();
    return now - citiesCache.timestamp < CACHE_DURATION;
  };

  const fetchCities = async () => {
    try {
      setLoading(true);

      // Check if we have valid cached data
      if (isCacheValid() && citiesCache) {
        setCities(citiesCache.data);
        setError(null);
        setLoading(false);
        return;
      }

      // Fetch from API if no valid cache
      const cityData = await cityService.getCities();

      // Update cache
      citiesCache = {
        data: cityData,
        timestamp: Date.now(),
      };

      setCities(cityData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch cities");
      console.error("Error fetching cities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleCreateCity = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditCity = (city: CityType) => {
    setSelectedCity(city);
    setIsEditModalOpen(true);
  };

  const handleDeleteCity = (city: CityType) => {
    setSelectedCity(city);
    setIsDeleteModalOpen(true);
  };

  const handleCityCreated = (newCity: CityType) => {
    setCities((prev) => [...prev, newCity]);

    // Update cache
    if (citiesCache) {
      citiesCache.data = [...citiesCache.data, newCity];
    }
  };

  const handleCityUpdated = (updatedCity: CityType) => {
    setCities((prev) =>
      prev.map((city) => (city.id === updatedCity.id ? updatedCity : city))
    );

    // Update cache
    if (citiesCache) {
      citiesCache.data = citiesCache.data.map((city) =>
        city.id === updatedCity.id ? updatedCity : city
      );
    }
  };

  const handleCityDeleted = () => {
    if (selectedCity) {
      setCities((prev) => prev.filter((city) => city.id !== selectedCity.id));

      // Update cache
      if (citiesCache) {
        citiesCache.data = citiesCache.data.filter(
          (city) => city.id !== selectedCity.id
        );
      }
    }
  };

  const refreshCities = () => {
    citiesCache = null;
    fetchCities();
  };

  // Calculate pagination values
  const totalCities = filteredCities.length;
  const totalPages = Math.ceil(totalCities / citiesPerPage);
  const startIndex = (currentPage - 1) * citiesPerPage;
  const endIndex = startIndex + citiesPerPage;
  const currentCities = filteredCities.slice(startIndex, endIndex);

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
              onClick={handleCreateCity}
              className="h-8 gap-1"
              variant="outline"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Tambah Kota
              </span>
            </Button>
            <Button
              onClick={refreshCities}
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
                  <h1>Kota</h1>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-white"
                  >
                    0 Kota
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>Loading cities...</CardDescription>
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
              onClick={handleCreateCity}
              className="h-8 gap-1"
              variant="outline"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Tambah Kota
              </span>
            </Button>
            <Button
              onClick={refreshCities}
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
                  <h1>Kota</h1>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-white"
                  >
                    0 Kota
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>Error loading cities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center items-center h-32 gap-2">
                <div className="text-red-500">{error}</div>
                <Button onClick={refreshCities} variant="outline" size="sm">
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
            onClick={handleCreateCity}
            className="h-8 gap-1"
            variant="outline"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Tambah Kota
            </span>
          </Button>
          <Button
            onClick={refreshCities}
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
                <h1>Kota</h1>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-white"
                >
                  {totalCities} Kota
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>Manage cities in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={1}>ID</TableHead>
                  <TableHead colSpan={3}>Name</TableHead>
                  <TableHead colSpan={1}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCities.length > 0 ? (
                  currentCities.map((city) => (
                    <City
                      key={city.id}
                      city={city}
                      onEdit={() => handleEditCity(city)}
                      onDelete={() => handleDeleteCity(city)}
                    />
                  ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No cities found
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
                  {totalCities > 0 ? startIndex + 1 : 0}-
                  {Math.min(endIndex, totalCities)}
                </strong>{" "}
                of <strong>{totalCities}</strong> cities
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
                  disabled={currentPage === totalPages || totalCities === 0}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
        {/* Create City Modal */}
        <CityCreateFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCityCreated}
        />

        {/* Update User Modal */}
        {isEditModalOpen && selectedCity && (
          <CityUpdateFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            city={selectedCity}
            onSuccess={handleCityUpdated}
          />
        )}

        {/* Delete User Modal */}
        {isDeleteModalOpen && selectedCity && (
          <DeleteCityModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            city={selectedCity}
            onSuccess={handleCityDeleted}
          />
        )}
      </div>
    </>
  );
}
