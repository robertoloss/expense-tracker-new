import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button"

type ResetButtonProps = {
  onClick: () => void;
  disabled: boolean;
}
export default function ResetDDownsButton({ onClick, disabled }: ResetButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={`h-10 w-10 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
      disabled={disabled}
      aria-label="Reset selections"
    >
      <RotateCcw className="h-4 w-4" />
    </Button>
  )
}
