import { useState, useRef, useCallback, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<unknown>;
  children: ReactNode;
  threshold?: number;
  maxPull?: number;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 60,
  maxPull = 100,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isRefreshing) return;
      const scrollTop = containerRef.current?.closest('[data-scroll-container]')?.scrollTop
        ?? document.documentElement.scrollTop
        ?? window.scrollY;
      if (scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    },
    [isRefreshing],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!pulling.current || isRefreshing) return;
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0) {
        setPullDistance(Math.min(diff * 0.5, maxPull));
      }
    },
    [isRefreshing, maxPull],
  );

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current || isRefreshing) return;
    pulling.current = false;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold * 0.6);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);
  const showIndicator = pullDistance > 10 || isRefreshing;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden transition-[height] duration-200',
          !pulling.current && !isRefreshing && 'duration-300',
        )}
        style={{ height: showIndicator ? pullDistance : 0 }}
      >
        <RefreshCw
          className={cn(
            'h-5 w-5 text-muted-foreground transition-all duration-200',
            isRefreshing && 'animate-spin text-primary',
            showIndicator ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
            progress >= 1 && !isRefreshing && 'text-primary',
          )}
          style={{
            transform: isRefreshing ? undefined : `rotate(${progress * 360}deg)`,
          }}
        />
      </div>
      {children}
    </div>
  );
}
