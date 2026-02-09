import { Button } from '@/components/ui/button';
import { AlertBanner } from '@/components/AlertBanner';
import { useNavigate } from 'react-router-dom';

export function RouteErrorFallback() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 space-y-4">
      <AlertBanner variant="error" title="Falha ao carregar a página">
        Tente novamente ou volte para a tela inicial.
      </AlertBanner>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => window.location.reload()}>
          Recarregar
        </Button>
        <Button className="flex-1" onClick={() => navigate('/app/dashboard')}>
          Ir para início
        </Button>
      </div>
    </div>
  );
}
