import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { supabase } from '@/lib/supabase';
import { clearPendingMagicLinkEmail } from '@/lib/magic-link-state';
import { useSession } from '@/web/session-context';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/pods', label: 'Pods' },
  { to: '/create-event', label: 'Create Event' },
  { to: '/create-pod', label: 'Create Pod' },
  { to: '/invites', label: 'Invites' },
  { to: '/notifications', label: 'Notifications' },
];

export function AppLayout() {
  const navigate = useNavigate();
  const { user } = useSession();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearPendingMagicLinkEmail();
    navigate('/auth');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Gatherer</p>
          <h1>Coordination for trusted groups</h1>
        </div>
        <div className="topbar-actions">
          {user ? <span className="pill">{user.email ?? 'Signed in'}</span> : null}
          {user ? (
            <button className="btn btn-outline" onClick={handleSignOut} type="button">
              Sign out
            </button>
          ) : (
            <NavLink className="btn btn-outline" to="/auth">
              Sign in
            </NavLink>
          )}
        </div>
      </header>

      <nav className="navbar">
        {navItems.map((item) => (
          <NavLink key={item.to} className="nav-link" end={item.end} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
