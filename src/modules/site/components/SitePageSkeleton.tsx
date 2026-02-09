import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function SitePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-card/90 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-full">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-1 md:gap-3">
            <Skeleton className="hidden md:block h-9 w-20 rounded-md" />
            <Skeleton className="hidden md:block h-9 w-20 rounded-md" />
            <Skeleton className="hidden md:block h-9 w-16 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-16 bg-primary">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-20 md:pt-32 pb-20 md:pb-40">
          <Skeleton className="h-6 w-40 rounded-full bg-primary-foreground/10" />
          <Skeleton className="mt-6 h-9 w-3/4 max-w-md bg-primary-foreground/10 md:h-12" />
          <Skeleton className="mt-3 h-9 w-1/2 max-w-sm bg-primary-foreground/10 md:h-12" />
          <Skeleton className="mt-5 h-4 w-full max-w-lg bg-primary-foreground/10" />
          <Skeleton className="mt-2 h-4 w-2/3 max-w-sm bg-primary-foreground/10" />
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-13 w-40 rounded-md bg-primary-foreground/10" />
            <Skeleton className="h-13 w-40 rounded-md bg-primary-foreground/10" />
          </div>
        </div>
      </section>

      {/* StatsBar */}
      <div className="relative -mt-8 z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="pt-5 pb-5 text-center">
                  <Skeleton className="mx-auto h-7 w-16 md:h-9 md:w-20" />
                  <Skeleton className="mx-auto mt-1 h-3 w-20 md:h-4 md:w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* HowItWorks */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="max-w-xl mx-auto text-center mb-12 md:mb-16">
            <Skeleton className="mx-auto h-6 w-32 rounded-full" />
            <Skeleton className="mx-auto mt-4 h-8 w-64 md:h-10" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="pt-6 pb-6 space-y-3">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
