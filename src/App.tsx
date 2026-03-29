import { lazy, Suspense, type ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, RequireAuth, FingerprintProvider } from '@/modules/auth';
import { NotificationsSocketProvider } from '@/modules/notification';
import { CaseProvider } from '@/modules/process';
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
const VerifyPage = lazy(() => import('./modules/auth/pages/VerifyPage'));
const DashboardPage = lazy(() => import('./modules/dashboard/pages/DashboardPage'));
const ProcessListPage = lazy(() => import('./modules/process/pages/ProcessListPage'));
const ProcessDetailPage = lazy(() => import('./modules/process/pages/ProcessDetailPage'));
const ProcessTimelinePage = lazy(() => import('./modules/process/pages/ProcessTimelinePage'));
const PendenciesPage = lazy(() => import('./modules/process/pages/PendenciesPage'));
const UploadPage = lazy(() => import('./modules/process/pages/UploadPage'));
const PaymentPage = lazy(() => import('./modules/process/pages/PaymentPage'));
const GPSStatusPage = lazy(() => import('./modules/process/pages/GPSStatusPage'));
const HistoryPage = lazy(() => import('./modules/process/pages/HistoryPage'));
const DocumentListPage = lazy(() => import('./modules/document-signing/pages/DocumentListPage'));
const DocumentSigningPage = lazy(() => import('./modules/document-signing/pages/DocumentSigningPage'));
const NotificationsPage = lazy(() => import('./modules/notification/pages/NotificationsPage'));
const NotificationSettingsPage = lazy(() => import('./modules/notification/pages/NotificationSettingsPage'));
const SchedulingPage = lazy(() => import('./modules/scheduling/pages/SchedulingPage'));
const SchedulingConfirmationPage = lazy(() => import('./modules/scheduling/pages/SchedulingConfirmationPage'));
const SupportPage = lazy(() => import('./modules/support/pages/SupportPage'));
const TicketPage = lazy(() => import('./modules/support/pages/TicketPage'));
const InstallPage = lazy(() => import('./modules/app/pages/InstallPage'));
const ProfilePage = lazy(() => import('./modules/profile/pages/ProfilePage'));
const PersonalDataPage = lazy(() => import('./modules/profile/pages/PersonalDataPage'));
const AddressPage = lazy(() => import('./modules/profile/pages/AddressPage'));
const PreferencesPage = lazy(() => import('./modules/profile/pages/PreferencesPage'));
const SecurityPage = lazy(() => import('./modules/profile/pages/SecurityPage'));
const SessionsPage = lazy(() => import('./modules/profile/pages/SessionsPage'));
const DevicesPage = lazy(() => import('./modules/profile/pages/DevicesPage'));
const NotFound = lazy(() => import('./modules/app/pages/NotFound'));

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
          <FingerprintProvider>
          <AuthProvider>
          <NotificationsSocketProvider>
          <CaseProvider>
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
                  <Route path="/acesso/link-magico/verificar" element={routeElement(<MagicLinkVerifyPage />)} />
                  <Route path="/acesso/verificar" element={routeElement(<VerifyPage />)} />
                  <Route path="/instalar" element={routeElement(<InstallPage />)} />

                  {/* Protected routes */}
                  <Route element={<RequireAuth />}>
                  <Route element={routeElement(<AppLayout />)}>
                    <Route path="/app/dashboard" element={routeElement(<DashboardPage />)} />
                    <Route path="/app/process" element={routeElement(<ProcessListPage />)} />
                    <Route path="/app/process/:id" element={routeElement(<ProcessDetailPage />)} />
                    <Route
                      path="/app/process/:id/timeline"
                      element={routeElement(<ProcessTimelinePage />)}
                    />
                    <Route
                      path="/app/process/:id/pendencias"
                      element={routeElement(<PendenciesPage />)}
                    />
                    <Route
                      path="/app/process/:id/pendencias/:pendencyId/upload"
                      element={routeElement(<UploadPage />)}
                    />
                    <Route
                      path="/app/process/:id/pendencias/:pendencyId/pagamento"
                      element={routeElement(<PaymentPage />)}
                    />
                    <Route path="/app/documentos" element={routeElement(<DocumentListPage />)} />
                    <Route path="/app/documentos/:termId" element={routeElement(<DocumentSigningPage />)} />
                    <Route path="/app/notifications" element={routeElement(<NotificationsPage />)} />
                    <Route path="/app/agendamento" element={routeElement(<SchedulingPage />)} />
                    <Route
                      path="/app/agendamento/confirmacao"
                      element={routeElement(<SchedulingConfirmationPage />)}
                    />
                    <Route path="/app/historico" element={routeElement(<HistoryPage />)} />
                    <Route path="/app/profile" element={routeElement(<ProfilePage />)} />
                    <Route path="/app/profile/dados" element={routeElement(<PersonalDataPage />)} />
                    <Route path="/app/profile/endereco" element={routeElement(<AddressPage />)} />
                    <Route
                      path="/app/profile/preferencias"
                      element={routeElement(<PreferencesPage />)}
                    />
                    <Route path="/app/profile/seguranca" element={routeElement(<SecurityPage />)} />
                    <Route path="/app/profile/sessoes" element={routeElement(<SessionsPage />)} />
                    <Route path="/app/profile/dispositivos" element={routeElement(<DevicesPage />)} />
                    <Route path="/app/suporte" element={routeElement(<SupportPage />)} />
                    <Route path="/app/suporte/chamado" element={routeElement(<TicketPage />)} />
                    <Route path="/app/gps" element={routeElement(<GPSStatusPage />)} />
                    <Route
                      path="/app/notifications/settings"
                      element={routeElement(<NotificationSettingsPage />)}
                    />
                  </Route>
                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={routeElement(<NotFound />)} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CaseProvider>
          </NotificationsSocketProvider>
          </AuthProvider>
          </FingerprintProvider>
        </TooltipProvider>
      </BrandProvider>
    </AppErrorBoundary>
  </QueryClientProvider>
);

export default App;
