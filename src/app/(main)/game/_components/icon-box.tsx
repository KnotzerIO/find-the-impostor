import { cn } from "@/src/lib/utils";
import { LucideIcon } from "lucide-react";

interface IconBoxProps {
  icon: LucideIcon;
  color: "blue" | "purple" | "green" | "red";
  size?: "sm" | "md" | "lg";
  rounded?: "lg" | "xl";
  className?: string;
}

const colorMap = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  green: "bg-green-500",
  red: "bg-red-500",
};

const sizeMap = {
  sm: { container: "w-6 h-6", icon: "w-3 h-3" },
  md: { container: "w-8 h-8", icon: "w-4 h-4" },
  lg: { container: "w-12 h-12", icon: "w-6 h-6" },
};

const roundedMap = {
  lg: "rounded-lg",
  xl: "rounded-xl",
};

export function IconBox({
  icon: Icon,
  color = "blue",
  className,
  size = "md",
  rounded = "lg",
}: IconBoxProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        colorMap[color],
        sizeMap[size].container,
        roundedMap[rounded],
        className,
      )}
    >
      <Icon className={cn(sizeMap[size].icon, "text-white")} />
    </div>
  );
}
