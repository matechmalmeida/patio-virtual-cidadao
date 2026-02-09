import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  Download,
  Smartphone,
  Wifi,
  Zap,
  Bell,
  Share,
  PlusSquare,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export default function InstallPage() {
  const { canInstall, isInstalled, isIOS, install } = usePWAInstall();

  const benefits = [
    { icon: Zap, title: 'Acesso rápido', description: 'Abra direto da tela inicial, como um app' },
    { icon: Wifi, title: 'Funciona offline', description: 'Consulte informações mesmo sem internet' },
    { icon: Bell, title: 'Notificações', description: 'Receba alertas sobre seu processo' },
    { icon: Smartphone, title: 'Tela cheia', description: 'Experiência imersiva sem barra do navegador' },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">Instalar aplicativo</h1>
        </div>

        {/* Hero */}
        <div className="text-center space-y-3 py-4">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Download className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Remoção Veicular</h2>
          <p className="text-sm text-muted-foreground">
            Instale o portal no seu celular para acompanhar o processo de remoção de forma rápida e prática.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-2">
                <benefit.icon className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{benefit.title}</p>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Install action */}
        {isInstalled ? (
          <Card className="border-0 shadow-md bg-primary/5">
            <CardContent className="p-5 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Aplicativo já instalado!</p>
                <p className="text-xs text-muted-foreground">
                  Você já pode acessar pela tela inicial do seu celular.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : canInstall ? (
          <Button onClick={install} className="w-full h-12 font-semibold text-base" size="lg">
            <Download className="h-5 w-5" />
            Instalar agora
          </Button>
        ) : isIOS ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-5 space-y-4">
              <p className="text-sm font-semibold">Como instalar no iPhone/iPad:</p>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <div className="flex items-center gap-2 text-sm">
                    Toque em <Share className="h-4 w-4 text-primary" /> <strong>Compartilhar</strong>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <div className="flex items-center gap-2 text-sm">
                    Selecione <PlusSquare className="h-4 w-4 text-primary" />{' '}
                    <strong>Adicionar à Tela de Início</strong>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <p className="text-sm">
                    Toque em <strong>Adicionar</strong>
                  </p>
                </li>
              </ol>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-md">
            <CardContent className="p-5 space-y-2">
              <p className="text-sm font-semibold">Como instalar:</p>
              <p className="text-xs text-muted-foreground">
                Acesse este site pelo navegador do seu celular (Chrome, Edge ou Samsung Internet) para ver o botão de instalação. No menu do navegador, procure por "Instalar aplicativo" ou "Adicionar à tela inicial".
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA back */}
        <div className="text-center pt-2">
          <Link to="/acesso" className="text-sm text-primary font-medium hover:underline">
            Acessar o portal pelo navegador →
          </Link>
        </div>
      </div>
    </div>
  );
}
