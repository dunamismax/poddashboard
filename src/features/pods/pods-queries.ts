import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type PodSummary = {
  id: string;
  name: string;
  description: string | null;
  location_text: string | null;
  role: 'owner' | 'admin' | 'member';
};

export type PodMember = {
  user_id: string;
  role: PodSummary['role'];
};

const podKeys = {
  all: ['pods'] as const,
  byUser: (userId: string) => [...podKeys.all, 'by-user', userId] as const,
  members: (podId: string) => [...podKeys.all, 'members', podId] as const,
};

type PodMembershipRow = {
  role: PodSummary['role'];
  pod:
    | {
        id: string;
        name: string;
        description: string | null;
        location_text: string | null;
      }
    | {
        id: string;
        name: string;
        description: string | null;
        location_text: string | null;
      }[]
    | null;
};

async function fetchPodsByUser(userId: string): Promise<PodSummary[]> {
  const { data, error } = await supabase
    .from('pod_memberships')
    .select('role, pod:pods(id,name,description,location_text)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('joined_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data as PodMembershipRow[])
    .map((row) => {
      const pod = Array.isArray(row.pod) ? row.pod[0] ?? null : row.pod;
      return pod ? { ...pod, role: row.role } : null;
    })
    .filter((row): row is PodSummary => Boolean(row));
}

async function fetchPodMembers(podId: string): Promise<PodMember[]> {
  const { data, error } = await supabase
    .from('pod_memberships')
    .select('user_id,role')
    .eq('pod_id', podId)
    .eq('is_active', true)
    .order('joined_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as PodMember[];
}

type CreatePodInput = {
  name: string;
  description?: string | null;
  locationText?: string | null;
};

async function createPod({ name, description, locationText }: CreatePodInput) {
  const { data, error } = await supabase.rpc('create_pod_with_owner', {
    name,
    description: description ?? null,
    location_text: locationText ?? null,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Unable to create pod.');
  }

  return data as string;
}

export function usePodsByUser(userId?: string) {
  return useQuery({
    queryKey: podKeys.byUser(userId ?? 'anonymous'),
    queryFn: () => fetchPodsByUser(userId ?? ''),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}

export function usePodMembers(podId?: string) {
  return useQuery({
    queryKey: podKeys.members(podId ?? 'unknown'),
    queryFn: () => fetchPodMembers(podId ?? ''),
    enabled: Boolean(podId),
    staleTime: 30_000,
  });
}

export function useCreatePod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: podKeys.all });
    },
  });
}
