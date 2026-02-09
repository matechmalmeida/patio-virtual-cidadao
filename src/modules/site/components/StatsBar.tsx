import { Card, CardContent } from '@/components/ui/card';
import type { SiteStat } from '@/types/site';

interface StatsBarProps {
  stats: SiteStat[];
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-lg">
            <CardContent className="pt-5 pb-5 text-center">
              <p className="text-xl md:text-3xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-[11px] md:text-sm text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
