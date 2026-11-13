import { Suspense, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PortalShell } from '@/components/PortalUI';
import { Protected } from '@/components/Protected';
import { AuthProvider, useAuth } from '@/lib/auth';
import { homeForRole } from '@/lib/roles';
import { LoginPage } from '@/pages/LoginPage';
import { AccountsPage } from '@/pages/AccountsPage';
import { StudentDashboard, EnrollmentPage, GradesPage, ProgressPage, DocumentsPage, RegistrarDashboard } from '@/pages/PortalPages';
import { ApplicantDashboard, InstructorDashboard, AdviserDashboard, ProgramHeadDashboard, AcademicAdminDashboard, AdmissionsDashboard, RecordsDashboard, FinanceDashboard, ScholarshipDashboard, OJTDashboard, ResearchDashboard, SystemAdminDashboard, AuditorDashboard, SuperAdminDashboard } from '@/pages/roleDashboards';
import { Link, Redirect, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Redirect to={user ? homeForRole(user.role) : '/login'} />;
}

function Router() {
  return <PortalShell>
    <RoutedErrorBoundary>
      <Suspense fallback={<main className="main-content"><div className="eyebrow">Northfield College · Campus Portal</div><h1>Loading your workspace</h1><p className="subtitle">Fetching the latest records…</p></main>}>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={HomeRoute} />

        {/* Student workspace */}
        <Route path="/student/dashboard"><Protected roles={['student']}><StudentDashboard /></Protected></Route>
        <Route path="/student/enrollment"><Protected roles={['student']}><EnrollmentPage /></Protected></Route>
        <Route path="/student/grades"><Protected roles={['student']}><GradesPage /></Protected></Route>
        <Route path="/student/progress"><Protected roles={['student']}><ProgressPage /></Protected></Route>
        <Route path="/student/documents"><Protected roles={['student']}><DocumentsPage /></Protected></Route>

        {/* Registrar office */}
        <Route path="/registrar/dashboard"><Protected roles={['registrar']}><RegistrarDashboard /></Protected></Route>

        {/* Role workspaces */}
        <Route path="/workspace/applicant"><Protected roles={['applicant']}><ApplicantDashboard /></Protected></Route>
        <Route path="/workspace/instructor"><Protected roles={['instructor']}><InstructorDashboard /></Protected></Route>
        <Route path="/workspace/academic-adviser"><Protected roles={['academic-adviser']}><AdviserDashboard /></Protected></Route>
        <Route path="/workspace/program-head"><Protected roles={['program-head']}><ProgramHeadDashboard /></Protected></Route>
        <Route path="/workspace/academic-administrator"><Protected roles={['academic-administrator']}><AcademicAdminDashboard /></Protected></Route>
        <Route path="/workspace/admissions-officer"><Protected roles={['admissions-officer']}><AdmissionsDashboard /></Protected></Route>
        <Route path="/workspace/records-officer"><Protected roles={['records-officer']}><RecordsDashboard /></Protected></Route>
        <Route path="/workspace/finance-officer"><Protected roles={['finance-officer']}><FinanceDashboard /></Protected></Route>
        <Route path="/workspace/scholarship-officer"><Protected roles={['scholarship-officer']}><ScholarshipDashboard /></Protected></Route>
        <Route path="/workspace/ojt-coordinator"><Protected roles={['ojt-coordinator']}><OJTDashboard /></Protected></Route>
        <Route path="/workspace/research-coordinator"><Protected roles={['research-coordinator']}><ResearchDashboard /></Protected></Route>
        <Route path="/workspace/system-administrator"><Protected roles={['system-administrator']}><SystemAdminDashboard /></Protected></Route>
        <Route path="/workspace/auditor-compliance"><Protected roles={['auditor-compliance']}><AuditorDashboard /></Protected></Route>
        <Route path="/workspace/super-administrator"><Protected roles={['super-administrator']}><SuperAdminDashboard /></Protected></Route>

        {/* Account provisioning */}
        <Route path="/admin/accounts"><Protected roles={['system-administrator', 'super-administrator']}><AccountsPage /></Protected></Route>

        <Route>
          <main className="main-content"><div className="eyebrow">Northfield College · Campus Portal</div><h1>Page not found</h1><p className="subtitle">That address is not part of this portal.</p><Link className="btn btn-primary" href="/" style={{ marginTop: 18 }}>Go to my dashboard</Link></main>
        </Route>
      </Switch>
      </Suspense>
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
        <AuthProvider>
          <Router />
        </AuthProvider>
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>;
}

export default App;
