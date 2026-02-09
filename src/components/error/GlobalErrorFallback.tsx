import { Button } from '@/components/ui/button';
import { AlertBanner } from '@/components/AlertBanner';

export function GlobalErrorFallback() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <AlertBanner variant="error" title="Aplicação indisponível">
          Ocorreu uma falha inesperada no aplicativo.
        </AlertBanner>
        <Button className="w-full" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
