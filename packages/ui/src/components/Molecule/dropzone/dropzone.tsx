import { useState, useRef, type DragEvent, type ChangeEvent, type ReactNode } from "react";
import { cn } from "../../../utils";
import { Icon } from "../../Atom/icon";
import { Button } from "../../Atom/button";

export interface DropzoneProps {
  /** Accepted mime types or file extensions (e.g. "image/*", ".pdf,.docx") */
  accept?: string;
  /** Allow multiple files upload */
  multiple?: boolean;
  /** Max file size in bytes */
  maxSize?: number;
  /** Callback fired when valid files are dropped/selected */
  onFilesAccepted?: (files: File[]) => void;
  /** Callback fired when files are rejected (exceeded size, invalid type) */
  onFilesRejected?: (files: { file: File; reason: string }[]) => void;
  /** Title text */
  title?: string;
  /** Subtitle / description text */
  description?: string;
  /** Custom icon override */
  icon?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
}

export function Dropzone({
  accept,
  multiple = false,
  maxSize,
  onFilesAccepted,
  onFilesRejected,
  title = "Drop files here or click to upload",
  description = "Upload your documents or images seamlessly",
  icon,
  disabled = false,
  className,
}: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    const accepted: File[] = [];
    const rejected: { file: File; reason: string }[] = [];

    for (const file of files) {
      if (maxSize && file.size > maxSize) {
        rejected.push({ file, reason: "File size exceeds limit" });
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length > 0) onFilesAccepted?.(accepted);
    if (rejected.length > 0) onFilesRejected?.(rejected);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-input/60 p-8 text-center transition-all cursor-pointer bg-surface hover:bg-surface-alt/50",
        isDragActive && "border-accent bg-accent/5 ring-4 ring-accent/10 scale-[1.005]",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none hover:bg-surface",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
      <div className="flex size-14 items-center justify-center rounded-full bg-surface-alt text-accent mb-4 shadow-2xs">
        {icon ?? <Icon name="cloud-upload" className="size-7" />}
      </div>
      <p className="font-semibold text-primary text-sm mb-1">{title}</p>
      <p className="text-secondary text-xs max-w-sm mb-4">{description}</p>
      <Button
        variant="outline"
        size="sm"
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        Browse Files
      </Button>
    </div>
  );
}
