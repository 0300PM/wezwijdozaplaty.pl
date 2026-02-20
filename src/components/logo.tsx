import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-headline text-2xl font-bold text-primary",
        className
      )}
    >
      Wezwwij Do Zaplaty
    </span>
  );
}
