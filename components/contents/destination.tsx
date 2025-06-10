import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { DestinationType } from "@/types/types";

interface DestinationProps {
  destination: DestinationType;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export function Destination({ destination, onEdit, onDelete, onView }: DestinationProps) {
  return (
    <TableRow>
      <TableCell colSpan={2} className="font-base">
        {destination.destination_name}
      </TableCell>
      <TableCell className="font-base">
        {destination.city.name}
      </TableCell>
      <TableCell className="font-base">
        {destination.address}
      </TableCell>
      <TableCell className="font-base">
        {destination.entry_fee}
      </TableCell>
      <TableCell className="flex gap-x-2">
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
