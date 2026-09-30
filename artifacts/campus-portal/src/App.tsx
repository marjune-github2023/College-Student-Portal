import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PortalShell } from '@/components/PortalUI';
import { LoginPage, StudentDashboard, EnrollmentPage, GradesPage, ProgressPage, DocumentsPage, RegistrarDashboard, RoleWorkspacePage } from '@/pages/PortalPages';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return <PortalShell>
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={StudentDashboard} />
        <Route path="/student/dashboard" component={StudentDashboard} />
        <Route path="/student/enrollment" component={EnrollmentPage} />
        <Route path="/student/grades" component={GradesPage} />
        <Route path="/student/progress" component={ProgressPage} />
        <Route path="/student/documents" component={DocumentsPage} />
        <Route path="/registrar/dashboard" component={RegistrarDashboard} />
        <Route path="/workspace/:slug" component={RoleWorkspacePage} />
        <Route>
          <main className="main-content"><div className="eyebrow">Northfield College · Campus Portal</div><h1>Page not found</h1><p className="subtitle">That address is not part of this portal preview.</p><Link className="btn btn-primary" href="/student/dashboard" style={{ marginTop: 18 }}>Return to student dashboard</Link></main>
        </Route>
      </Switch>
    </RoutedErrorBoundary>
  </PortalShell>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>;
}

export default App;