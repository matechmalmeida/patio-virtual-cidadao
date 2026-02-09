import { Skeleton } from '@/components/ui/skeleton';

export default function LegalPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-card/90 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-full">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-1 md:gap-3">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      </div>

      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="mt-6 h-9 w-3/4 md:h-10" />
          <Skeleton className="mt-3 h-4 w-48" />

          <div className="mt-10 space-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
