import { useSuspenseQuery } from '@tanstack/react-query';
import { apiFetch } from './api';
import type { Request, StudentOverview, WorkspacePreview } from './portalTypes';

/**
 * Portal data comes from the API, which reads the Postgres tables seeded by
 * `lib/db/seed-portal.mjs`. Suspense keeps each dashboard from rendering with
 * placeholder values while the request is in flight.
 */

const STALE_TIME = 5 * 60 * 1000;

export function useWorkspacePreviews(): WorkspacePreview[] {
  const { data } = useSuspenseQuery({
    queryKey: ['portal', 'workspaces'],
    queryFn: () => apiFetch<{ workspaces: WorkspacePreview[] }>('/portal/workspaces'),
    staleTime: STALE_TIME,
  });
  return data.workspaces;
}

export function useWorkspace(slug: string): WorkspacePreview {
  const workspace = useWorkspacePreviews().find((item) => item.slug === slug);
  if (!workspace) throw new Error(`Workspace "${slug}" is missing from the portal data.`);
  return workspace;
}

export function useStudentOverview(): StudentOverview {
  const { data } = useSuspenseQuery({
    queryKey: ['portal', 'student', 'overview'],
    queryFn: () => apiFetch<StudentOverview>('/portal/student/overview'),
    staleTime: STALE_TIME,
  });
  return data;
}

export function useServiceRequests(): Request[] {
  const { data } = useSuspenseQuery({
    queryKey: ['portal', 'service-requests'],
    queryFn: () => apiFetch<{ requests: Request[] }>('/portal/service-requests'),
    staleTime: STALE_TIME,
  });
  return data.requests;
}
