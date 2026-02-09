import { lazy, Suspense, type ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/modules/auth';
import { BrandProvider } from '@/contexts/BrandContext';
import { AppLayout } from '@/modules/app';
import { AppErrorBoundary } from '@/components/error/AppErrorBoundary';
import { GlobalErrorFallback } from '@/components/error/GlobalErrorFallback';
import { RouteErrorFallback } from '@/components/error/RouteErrorFallback';

const SitePage = lazy(() => import('./modules/site/pages/SitePage'));
const LegalPage = lazy(() => import('./modules/site/pages/LegalPage'));
const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./modules/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./modules/auth/pages/ResetPasswordPage'));
const MagicLinkRequestPage = lazy(() => import('./modules/auth/pages/MagicLinkRequestPage'));
const MagicLinkVerifyPage = lazy(() => import('./modules/auth/pages/MagicLinkVerifyPage'));
const TotpChallengePage = lazy(() => import('./modules/auth/pages/TotpChallengePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const PendenciesPage = lazy(() => import('./pages/PendenciesPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const SchedulingPage = lazy(() => import('./pages/SchedulingPage'));
const SchedulingConfirmationPage = lazy(() => import('./pages/SchedulingConfirmationPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const TicketPage = lazy(() => import('./pages/TicketPage'));
const TermSigningPage = lazy(() => import('./pages/TermSigningPage'));
const InstallPage = lazy(() => import('./pages/InstallPage'));
const GPSStatusPage = lazy(() => import('./pages/GPSStatusPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const NotificationSettingsPage = lazy(() => import('./pages/NotificationSettingsPage'));
const ProfilePage = lazy(() => import('./modules/profile/pages/ProfilePage'));
const PersonalDataPage = lazy(() => import('./modules/profile/pages/PersonalDataPage'));
const AddressPage = lazy(() => import('./modules/profile/pages/AddressPage'));
const PreferencesPage = lazy(() => import('./modules/profile/pages/PreferencesPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      gcTime: 5 * 60_000,
    },
  },
});

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground animate-pulse">Carregando...</span>
      </div>
    </div>
  );
}

function RouteBoundary({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <AppErrorBoundary key={location.pathname} fallback={<RouteErrorFallback />}>
      {children}
    </AppErrorBoundary>
  );
}

function routeElement(node: ReactNode) {
  return (
    <RouteBoundary>
      {node}
    </RouteBoundary>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppErrorBoundary fallback={<GlobalErrorFallback />}>
      <BrandProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={routeElement(<SitePage />)} />
                  <Route path="/legal/:slug" element={routeElement(<LegalPage />)} />
                  <Route path="/acesso" element={routeElement(<LoginPage />)} />
                  <Route path="/acesso/esqueci-senha" element={routeElement(<ForgotPasswordPage />)} />
                  <Route path="/acesso/nova-senha" element={routeElement(<ResetPasswordPage />)} />
                  <Route path="/acesso/link-magico" element={routeElement(<MagicLinkRequestPage />)} />
                  <Route path="/acesso/verificar" element={routeElement(<MagicLinkVerifyPage />)} />
                  <Route path="/acesso/2fa" element={routeElement(<TotpChallengePage />)} />
                  <Route path="/instalar" element={routeElement(<InstallPage />)} />

                  {/* Protected routes */}
                  <Route element={routeElement(<AppLayout />)}>
                    <Route path="/dashboard" element={routeElement(<DashboardPage />)} />
                    <Route path="/timeline" element={routeElement(<TimelinePage />)} />
                    <Route path="/pendencias" element={routeElement(<PendenciesPage />)} />
                    <Route path="/pendencias/:id/upload" element={routeElement(<UploadPage />)} />
                    <Route path="/notificacoes" element={routeElement(<NotificationsPage />)} />
                    <Route path="/agendamento" element={routeElement(<SchedulingPage />)} />
                    <Route
                      path="/agendamento/confirmacao"
                      element={routeElement(<SchedulingConfirmationPage />)}
                    />
                    <Route path="/historico" element={routeElement(<HistoryPage />)} />
                    <Route path="/app/profile" element={routeElement(<ProfilePage />)} />
                    <Route path="/app/profile/dados" element={routeElement(<PersonalDataPage />)} />
                    <Route path="/app/profile/endereco" element={routeElement(<AddressPage />)} />
                    <Route
                      path="/app/profile/preferencias"
                      element={routeElement(<PreferencesPage />)}
                    />
                    <Route path="/suporte" element={routeElement(<SupportPage />)} />
                    <Route path="/suporte/chamado" element={routeElement(<TicketPage />)} />
                    <Route path="/termo/:termId" element={routeElement(<TermSigningPage />)} />
                    <Route path="/gps" element={routeElement(<GPSStatusPage />)} />
                    <Route
                      path="/pendencias/:pendencyId/pagamento"
                      element={routeElement(<PaymentPage />)}
                    />
                    <Route
                      path="/notificacoes/configurar"
                      element={routeElement(<NotificationSettingsPage />)}
                    />
                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={routeElement(<NotFound />)} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </BrandProvider>
    </AppErrorBoundary>
  </QueryClientProvider>
);

export default App;
