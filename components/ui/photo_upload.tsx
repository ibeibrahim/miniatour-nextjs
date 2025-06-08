"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormLabel } from "@/components/ui/form";
import { Upload, X, User } from "lucide-react";

interface PhotoUploadProps {
  preview: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  error?: string;
  disabled?: boolean;
}

export function PhotoUpload({
  preview,
  onFileSelect,
  onRemove,
  error,
  disabled = false,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <FormLabel htmlFor="photo_profile">Profile Photo</FormLabel>

      <div className="flex items-center space-x-4">
        {/* Avatar Preview */}
        <Avatar className="h-20 w-20">
          <AvatarImage src={preview!} alt="Profile preview" />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>

        {/* Upload Area */}
        <div className="flex-1">
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${dragOver ? "border-primary bg-primary/5" : "border-gray-300"}
              ${error ? "border-red-300 bg-red-50" : ""}
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-primary hover:bg-primary/5"
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              id="photo_profile"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled}
            />

            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Drop an image here, or{" "}
              <span className="text-primary font-medium">click to browse</span>
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF, WebP up to {formatFileSize(5120 * 1024)}
            </p>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

          {/* Remove Button */}
          {preview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRemove}
              disabled={disabled}
              className="mt-2"
            >
              <X className="h-4 w-4 mr-1" />
              Remove Photo
            </Button>
          )}
        </div>
      </div>

      {/* File Info */}
      <div className="text-xs text-gray-500">
        <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
        <p>• Maximum file size: {formatFileSize(5120 * 1024)}</p>
        <p>• Recommended dimensions: 400x400 pixels</p>
      </div>
    </div>
  );
}
