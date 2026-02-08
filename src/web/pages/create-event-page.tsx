import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCreateEvent } from '@/features/events/events-queries';
import { usePodsByUser } from '@/features/pods/pods-queries';
import { useSession } from '@/web/session-context';
import { formatDateTimeForInput, toIsoDateTime } from '@/web/utils/date';

export function CreateEventPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useSession();
  const podsQuery = usePodsByUser(user?.id);
  const createEvent = useCreateEvent();

  const initialStart = useMemo(() => {
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);
    return formatDateTimeForInput(now);
  }, []);

  const [podId, setPodId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState(initialStart);
  const [endsAt, setEndsAt] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!podId && podsQuery.data && podsQuery.data.length > 0) {
      setPodId(podsQuery.data[0].id);
    }
  }, [podId, podsQuery.data]);

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
  const endsAtError = endsAtInvalid || endsAtBeforeStart;

  const handleSubmit = async () => {
    if (!user || !podId || titleError || startsAtError || endsAtError) return;
    setStatus(null);
    try {
      await createEvent.mutateAsync({
        userId: user.id,
        podId,
        title: title.trim(),
        description: description.trim() ? description.trim() : null,
        locationText: location.trim() ? location.trim() : null,
        startsAt: startsAtIso ?? new Date().toISOString(),
        endsAt: endsAtIso,
      });
      navigate('/');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to create event.');
    }
  };

  return (
    <div className="stack">
      <section className="panel">
        <h2>Create event</h2>
        <p className="muted">Choose a pod and set event timing details.</p>
      </section>

      <section className="panel">
        <h3>Choose a pod</h3>
        {podsQuery.isLoading ? (
          <p className="muted">Loading pods...</p>
        ) : (podsQuery.data?.length ?? 0) === 0 ? (
          <>
            <p className="muted">Create a pod before scheduling events.</p>
            <Link className="btn btn-outline" to="/create-pod">
              Create a pod
            </Link>
          </>
        ) : (
          <div className="stack">
            {(podsQuery.data ?? []).map((pod) => (
              <label className="select-row" key={pod.id}>
                <input
                  checked={podId === pod.id}
                  name="pod"
                  onChange={() => setPodId(pod.id)}
                  type="radio"
                />
                <span>
                  {pod.name} <span className="muted">({pod.location_text ?? 'No location'})</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h3>Event details</h3>
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
        {!user && !isLoading ? <p className="muted">Sign in to create events.</p> : null}
        <button
          className="btn btn-primary"
          disabled={
            isLoading ||
            !user ||
            !podId ||
            titleError ||
            startsAtError ||
            endsAtError ||
            createEvent.isPending
          }
          onClick={handleSubmit}
          type="button">
          Create event
        </button>
        {status ? <p className="muted">{status}</p> : null}
      </section>
    </div>
  );
}
