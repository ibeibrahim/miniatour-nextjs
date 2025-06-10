import { AppointmentType } from "@/types/types";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface AppointmentProps {
  appointment: AppointmentType;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export function Appointment({
  appointment,
  onEdit,
  onDelete,
  onView,
}: AppointmentProps) {
  return (
    <TableRow>
      <TableCell colSpan={1} className="font-medium">
        {appointment.id}
      </TableCell>
      <TableCell colSpan={3} className="font-medium">
        {appointment.user?.name}
      </TableCell>
      <TableCell colSpan={1} className="font-medium">
        {appointment.tourguide?.name}
      </TableCell>
      <TableCell colSpan={1} className="font-medium">
        {appointment.destination?.destination_name}
      </TableCell>
      <TableCell colSpan={1} className="font-medium">
        {appointment.appointment_date}
      </TableCell>
      <TableCell>
        {/* appointment status is pending | confirmed | completed | canceled */}
        <Badge
          variant="outline"
          className={
            appointment.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : appointment.status === "confirmed"
              ? "bg-blue-100 text-blue-700"
              : appointment.status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        >
          {appointment.status.charAt(0).toUpperCase() +
            appointment.status.slice(1)}
        </Badge>
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
