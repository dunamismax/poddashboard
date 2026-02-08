import { Link } from 'react-router-dom';

import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useNotificationsRealtime,
} from '@/features/notifications/notifications-queries';
import { useSession } from '@/web/session-context';
import { formatTimestamp } from '@/web/utils/date';

export function NotificationsPage() {
  const { user, isLoading: authLoading } = useSession();
  const notificationsQuery = useNotifications(user?.id);
  useNotificationsRealtime(user?.id);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount =
    notificationsQuery.data?.filter((notification) => !notification.read_at).length ?? 0;

  return (
    <section className="panel">
      <div className="section-header">
        <h2>Notifications</h2>
        <button
          className="btn btn-outline"
          disabled={!user || unreadCount === 0 || markAllRead.isPending}
          onClick={() => user && markAllRead.mutate({ recipientId: user.id })}
          type="button">
          Mark all read
        </button>
      </div>
      {authLoading || notificationsQuery.isLoading ? (
        <p className="muted">Loading notifications...</p>
      ) : !user ? (
        <p className="muted">Sign in to view notifications.</p>
      ) : (notificationsQuery.data?.length ?? 0) === 0 ? (
        <p className="muted">No notifications yet.</p>
      ) : (
        <ul className="list">
          {(notificationsQuery.data ?? []).map((notification) => (
            <li className="list-row" key={notification.id}>
              <div>
                <p>
                  {notification.title} {!notification.read_at ? <span className="pill">New</span> : null}
                </p>
                <p className="muted">
                  {notification.body ? `${notification.body} · ` : ''}
                  {formatTimestamp(notification.created_at)}
                </p>
              </div>
              <div className="actions">
                {!notification.read_at ? (
                  <button
                    className="btn btn-outline"
                    onClick={() => markRead.mutate({ id: notification.id })}
                    type="button">
                    Mark read
                  </button>
                ) : null}
                {notification.event_id ? (
                  <Link className="btn btn-outline" to={`/event/${notification.event_id}`}>
                    Open event
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
