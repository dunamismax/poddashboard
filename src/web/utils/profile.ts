import type { Profile } from '@/features/profiles/profiles-queries';

export function formatMemberName(userId: string, profile?: Profile) {
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');
  return (
    profile?.display_name ||
    fullName ||
    profile?.email ||
    `Member ${userId.slice(0, 4).toUpperCase()}`
  );
}
