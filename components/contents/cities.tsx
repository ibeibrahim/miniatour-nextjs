import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { CityType } from "@/types/types";

interface CitiesProps {
  city: CityType;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export function City({ city, onEdit, onDelete, onView }: CitiesProps) {
  return (
    <TableRow>
      <TableCell colSpan={1} className="font-medium">
        {city.id}
      </TableCell>
      <TableCell colSpan={3} className="font-medium">
        {city.name}
      </TableCell>
      <TableCell colSpan={1} className="flex gap-x-2">
        {onView && (
          <Button
            onClick={onView}
            variant="outline"
            size="icon"
            className="size-7"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button
            onClick={onEdit}
            variant="outline"
            size="icon"
            className="size-7"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={onDelete}
            variant="destructive"
            size="icon"
            className="size-7"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
