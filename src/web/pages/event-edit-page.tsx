import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useCancelEvent, useEventById, useUpdateEvent } from '@/features/events/events-queries';
import { usePodsByUser } from '@/features/pods/pods-queries';
import { useSession } from '@/web/session-context';
import { formatDateTimeForInput, toIsoDateTime } from '@/web/utils/date';

function normalizeText(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function EventEditPage() {
  const { id } = useParams();
  const eventId = id ?? '';
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useSession();

  const podsQuery = usePodsByUser(user?.id);
  const eventQuery = useEventById(eventId);
  const updateEvent = useUpdateEvent();
  const cancelEvent = useCancelEvent();
  const [hasLoaded, setHasLoaded] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!eventQuery.data || hasLoaded) return;
    setTitle(eventQuery.data.title ?? '');
    setDescription(eventQuery.data.description ?? '');
    setLocation(eventQuery.data.location_text ?? '');
    setStartsAt(formatDateTimeForInput(new Date(eventQuery.data.starts_at)));
    setEndsAt(eventQuery.data.ends_at ? formatDateTimeForInput(new Date(eventQuery.data.ends_at)) : '');
    setCancelReason(eventQuery.data.cancel_reason ?? '');
    setHasLoaded(true);
  }, [eventQuery.data, hasLoaded]);

  const titleError = title.trim().length === 0;
  const startsAtIso = toIsoDateTime(startsAt);
  const endsAtIso = endsAt ? toIsoDateTime(endsAt) : null;
  const startsAtError = !startsAtIso;
  const endsAtInvalid = Boolean(endsAt && !endsAtIso);
  const endsAtBeforeStart =
    Boolean(
      endsAtIso &&
        startsAtIso &&
        new Date(endsAtIso).getTime() < new Date(startsAtIso).getTime()
    );
  const loadedEvent = eventQuery.data;
  const endsAtError = endsAtInvalid || endsAtBeforeStart;
  const podRole = useMemo(
    () => (loadedEvent ? (podsQuery.data ?? []).find((pod) => pod.id === loadedEvent.pod_id)?.role : null),
    [loadedEvent, podsQuery.data]
  );
  const isCanceled = Boolean(eventQuery.data?.canceled_at);
  const canManageEvent = Boolean(
    user &&
      eventQuery.data &&
      (eventQuery.data.created_by === user.id || podRole === 'owner' || podRole === 'admin')
  );

  const changeCount = useMemo(() => {
    if (!eventQuery.data) return 0;
    let changes = 0;
    if (title.trim() && title.trim() !== eventQuery.data.title) changes += 1;
    if (normalizeText(description) !== (eventQuery.data.description ?? null)) changes += 1;
    if (normalizeText(location) !== (eventQuery.data.location_text ?? null)) changes += 1;
    if (startsAtIso && startsAtIso !== eventQuery.data.starts_at) changes += 1;
    if ((endsAtIso ?? null) !== (eventQuery.data.ends_at ?? null)) changes += 1;
    return changes;
  }, [description, endsAtIso, eventQuery.data, location, startsAtIso, title]);

  const handleSubmit = async () => {
    if (!user || !eventQuery.data || !canManageEvent || titleError || startsAtError || endsAtError) return;

    const payload = {
      eventId: eventQuery.data.id,
      userId: user.id,
      title: title.trim() !== eventQuery.data.title ? title.trim() : undefined,
      description:
        normalizeText(description) !== (eventQuery.data.description ?? null) ? normalizeText(description) : undefined,
      locationText:
        normalizeText(location) !== (eventQuery.data.location_text ?? null) ? normalizeText(location) : undefined,
      startsAt: startsAtIso !== eventQuery.data.starts_at ? startsAtIso ?? undefined : undefined,
      endsAt: (endsAtIso ?? null) !== (eventQuery.data.ends_at ?? null) ? endsAtIso : undefined,
    };

    if (
      typeof payload.title === 'undefined' &&
      typeof payload.description === 'undefined' &&
      typeof payload.locationText === 'undefined' &&
      typeof payload.startsAt === 'undefined' &&
      typeof payload.endsAt === 'undefined'
    ) {
      setStatus('No changes to save.');
      return;
    }

    setStatus(null);
    try {
      await updateEvent.mutateAsync(payload);
      navigate(`/event/${eventQuery.data.id}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to update event.');
    }
  };

  const handleCancel = async () => {
    if (!user || !eventQuery.data || !canManageEvent || isCanceled) return;
    setStatus(null);
    try {
      await cancelEvent.mutateAsync({
        eventId: eventQuery.data.id,
        userId: user.id,
        reason: normalizeText(cancelReason),
      });
      navigate(`/event/${eventQuery.data.id}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to cancel event.');
    }
  };

  const isLoading = authLoading || eventQuery.isLoading || podsQuery.isLoading;

  return (
    <section className="panel">
      <h2>Edit event</h2>
      {isLoading ? (
        <p className="muted">Loading event...</p>
      ) : !eventQuery.data ? (
        <p className="muted">You do not have access to this event.</p>
      ) : !canManageEvent ? (
        <p className="muted">Only the event host or pod admins can edit this event.</p>
      ) : isCanceled ? (
        <>
          <p className="error">This event has been canceled.</p>
          {eventQuery.data.cancel_reason ? <p className="muted">Reason: {eventQuery.data.cancel_reason}</p> : null}
          <Link className="btn btn-outline" to={`/event/${eventQuery.data.id}`}>
            Back to event
          </Link>
        </>
      ) : (
        <>
          <div className="grid">
            <label className="field">
              Title
              <input className="input" onChange={(event) => setTitle(event.target.value)} value={title} />
            </label>
            <label className="field full">
              Description
              <textarea
                className="input"
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                value={description}
              />
            </label>
            <label className="field">
              Location
              <input
                className="input"
                onChange={(event) => setLocation(event.target.value)}
                value={location}
              />
            </label>
            <label className="field">
              Starts at
              <input
                className="input"
                onChange={(event) => setStartsAt(event.target.value)}
                type="datetime-local"
                value={startsAt}
              />
            </label>
            <label className="field">
              Ends at
              <input
                className="input"
                onChange={(event) => setEndsAt(event.target.value)}
                type="datetime-local"
                value={endsAt}
              />
            </label>
          </div>
          {titleError ? <p className="error">Event title is required.</p> : null}
          {startsAtError ? <p className="error">Enter a valid start date and time.</p> : null}
          {endsAtInvalid ? <p className="error">Enter a valid end date and time.</p> : null}
          {endsAtBeforeStart ? <p className="error">End time must be after start time.</p> : null}
          <button
            className="btn btn-primary"
            disabled={titleError || startsAtError || endsAtError || updateEvent.isPending || changeCount === 0}
            onClick={handleSubmit}
            type="button">
            Save changes
          </button>

          <h3>Host controls</h3>
          <label className="field">
            Cancellation reason
            <textarea
              className="input"
              onChange={(event) => setCancelReason(event.target.value)}
              rows={2}
              value={cancelReason}
            />
          </label>
          <button
            className="btn btn-danger"
            disabled={cancelEvent.isPending}
            onClick={handleCancel}
            type="button">
            Cancel event
          </button>
          {status ? <p className="muted">{status}</p> : null}
        </>
      )}
    </section>
  );
}
