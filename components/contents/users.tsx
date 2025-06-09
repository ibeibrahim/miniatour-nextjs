import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserType } from "@/types/types";

interface UserProps {
  user: UserType;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export function User({ user, onEdit, onDelete, onView }: UserProps) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={user.photo_url ?? "/potrait_placeholder.png"}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{user.name}</TableCell>
      {user.role_id === 3 ? (
        <TableCell>
          <Badge
            variant="outline"
            className={
              user.fcm_token
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          >
            {user.fcm_token ? "● Active" : "● Inactive"}
          </Badge>
        </TableCell>
      ) : (
        <TableCell>
          <Badge
            variant="outline"
            className={
              user.is_active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          >
            {user.is_active ? "● Active" : "● Inactive"}
          </Badge>
        </TableCell>
      )}
      <TableCell className="font-medium">{user.email}</TableCell>
      {user.role_id === 2 && (
        <>
          <TableCell className="font-medium">Rp {user.price}</TableCell>
        </>
      )}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            {onView && (
              <DropdownMenuItem onClick={onView}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            )}

            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
            )}

            {onDelete && (
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
