
import { Loader } from "@/components/ui/loader";

export function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader className="h-12 w-12" />
        <p className="text-muted-foreground"></p>
      </div>
    </div>
  );
}
