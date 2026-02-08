import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useCreateInvite, usePodInvites } from '@/features/invites/invites-queries';
import { usePodMembers, usePodsByUser } from '@/features/pods/pods-queries';
import { useProfilesByIds } from '@/features/profiles/profiles-queries';
import { useSession } from '@/web/session-context';
import { formatMemberName } from '@/web/utils/profile';

export function PodDetailPage() {
  const { id } = useParams();
  const podId = id ?? '';

  const { user, isLoading: authLoading } = useSession();
  const podsQuery = usePodsByUser(user?.id);
  const pod = useMemo(() => (podsQuery.data ?? []).find((item) => item.id === podId), [podsQuery.data, podId]);
  const membersQuery = usePodMembers(podId);
  const memberIds = useMemo(() => (membersQuery.data ?? []).map((member) => member.user_id), [membersQuery.data]);
  const profilesQuery = useProfilesByIds(memberIds);
  const profileById = useMemo(
    () => new Map((profilesQuery.data ?? []).map((profile) => [profile.id, profile])),
    [profilesQuery.data]
  );
  const invitesQuery = usePodInvites(podId);
  const createInvite = useCreateInvite();

  const [inviteEmail, setInviteEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const isAdmin = pod?.role === 'owner' || pod?.role === 'admin';
  const inviteEmailError = inviteEmail.length > 0 && !inviteEmail.includes('@');

  const handleInvite = async () => {
    if (!user || !podId || inviteEmailError || inviteEmail.trim().length === 0) return;
    setStatus(null);
    try {
      await createInvite.mutateAsync({
        podId,
        invitedEmail: inviteEmail.trim().toLowerCase(),
        invitedBy: user.id,
      });
      setInviteEmail('');
      setStatus('Invite sent.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to send invite.');
    }
  };

  const isLoading = authLoading || podsQuery.isLoading || membersQuery.isLoading || profilesQuery.isLoading;

  return (
    <div className="stack">
      <section className="panel">
        <h2>{pod?.name ?? 'Pod'}</h2>
        {isLoading ? (
          <p className="muted">Loading pod...</p>
        ) : pod ? (
          <>
            <p className="muted">
              {pod.location_text ?? 'Location TBD'} · {pod.role}
            </p>
            {pod.description ? <p>{pod.description}</p> : null}
            <Link className="btn btn-outline" to="/create-event">
              Schedule event
            </Link>
          </>
        ) : (
          <p className="muted">You do not have access to this pod.</p>
        )}
      </section>

      <section className="panel">
        <h3>Members</h3>
        {membersQuery.isLoading ? (
          <p className="muted">Loading members...</p>
        ) : (membersQuery.data?.length ?? 0) === 0 ? (
          <p className="muted">No members yet.</p>
        ) : (
          <ul className="list">
            {(membersQuery.data ?? []).map((member) => {
              const profile = profileById.get(member.user_id);
              return (
                <li className="list-row" key={member.user_id}>
                  <div>
                    <p>{formatMemberName(member.user_id, profile)}</p>
                    <p className="muted">
                      {[profile?.phone, profile?.contact_email, profile?.contact_handle]
                        .filter(Boolean)
                        .join(' · ') || 'Profile not available yet'}
                    </p>
                  </div>
                  <span className="pill">{member.role}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {isAdmin ? (
        <section className="panel">
          <h3>Invite someone</h3>
          <label className="field">
            Email address
            <input
              className="input"
              onChange={(event) => setInviteEmail(event.target.value)}
              type="email"
              value={inviteEmail}
            />
          </label>
          {inviteEmailError ? <p className="error">Enter a valid email address.</p> : null}
          <button
            className="btn btn-primary"
            disabled={inviteEmailError || createInvite.isPending}
            onClick={handleInvite}
            type="button">
            Send invite
          </button>
          {status ? <p className="muted">{status}</p> : null}
          <h4>Pending invites</h4>
          {invitesQuery.isLoading ? (
            <p className="muted">Loading invites...</p>
          ) : (invitesQuery.data?.length ?? 0) === 0 ? (
            <p className="muted">No pending invites.</p>
          ) : (
            <ul className="list">
              {(invitesQuery.data ?? []).map((invite) => (
                <li className="list-row" key={invite.id}>
                  <p>{invite.invited_email ?? 'Invite'}</p>
                  <span className="pill">{invite.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
