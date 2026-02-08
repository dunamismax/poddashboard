import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { queryClient } from '@/lib/queryClient';
import { SessionProvider } from '@/web/session-context';
import { AppLayout } from '@/web/components/app-layout';
import { AuthCallbackPage } from '@/web/pages/auth-callback-page';
import { AuthPage } from '@/web/pages/auth-page';
import { CreateEventPage } from '@/web/pages/create-event-page';
import { CreatePodPage } from '@/web/pages/create-pod-page';
import { EventDetailPage } from '@/web/pages/event-detail-page';
import { EventEditPage } from '@/web/pages/event-edit-page';
import { HomePage } from '@/web/pages/home-page';
import { InvitesPage } from '@/web/pages/invites-page';
import { NotificationsPage } from '@/web/pages/notifications-page';
import { PodDetailPage } from '@/web/pages/pod-detail-page';
import { PodsPage } from '@/web/pages/pods-page';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/pods" element={<PodsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/create-pod" element={<CreatePodPage />} />
              <Route path="/create-event" element={<CreateEventPage />} />
              <Route path="/pod/:id" element={<PodDetailPage />} />
              <Route path="/event/:id" element={<EventDetailPage />} />
              <Route path="/event/edit/:id" element={<EventEditPage />} />
              <Route path="/invites" element={<InvitesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </QueryClientProvider>
  );
}
