import { Link } from 'react-router-dom';

import { useAcceptInvite, usePendingInvites } from '@/features/invites/invites-queries';
import { useSession } from '@/web/session-context';

export function InvitesPage() {
  const { user, isLoading: authLoading } = useSession();
  const invitesQuery = usePendingInvites(user?.id, user?.email ?? null);
  const acceptInvite = useAcceptInvite();

  const isLoading = authLoading || invitesQuery.isLoading;

  return (
    <section className="panel">
      <h2>Pending invites</h2>
      {isLoading ? (
        <p className="muted">Loading invites...</p>
      ) : !user ? (
        <p className="muted">Sign in to view your invites.</p>
      ) : (invitesQuery.data?.length ?? 0) === 0 ? (
        <p className="muted">No pending invites.</p>
      ) : (
        <ul className="list">
          {(invitesQuery.data ?? []).map((invite) => (
            <li className="list-row" key={invite.id}>
              <div>
                <p>{invite.pod?.name ?? 'Pod invite'}</p>
                <p className="muted">{invite.invited_email ?? 'Invited user'}</p>
              </div>
              <button
                className="btn btn-primary"
                disabled={acceptInvite.isPending}
                onClick={() => acceptInvite.mutate({ inviteId: invite.id })}
                type="button">
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
      {acceptInvite.data ? (
        <p className="muted">
          Invite accepted. <Link to={`/pod/${acceptInvite.data}`}>Open pod</Link>
        </p>
      ) : null}
      {acceptInvite.isError ? <p className="error">Unable to accept invite. Try again.</p> : null}
    </section>
  );
}
