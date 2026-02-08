import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreatePod } from '@/features/pods/pods-queries';
import { useSession } from '@/web/session-context';

export function CreatePodPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useSession();
  const createPod = useCreatePod();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const nameError = name.trim().length === 0;

  const handleSubmit = async () => {
    if (!user || nameError) return;
    setStatus(null);
    try {
      const podId = await createPod.mutateAsync({
        name: name.trim(),
        description: description.trim() ? description.trim() : null,
        locationText: location.trim() ? location.trim() : null,
      });
      setStatus('Pod created.');
      navigate(`/pod/${podId}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to create pod.');
    }
  };

  return (
    <section className="panel">
      <h2>Create pod</h2>
      <div className="grid">
        <label className="field">
          Pod name
          <input className="input" onChange={(event) => setName(event.target.value)} value={name} />
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
      </div>
      {nameError ? <p className="error">Pod name is required.</p> : null}
      {!user && !isLoading ? <p className="muted">Sign in to create a pod.</p> : null}
      <button
        className="btn btn-primary"
        disabled={isLoading || !user || nameError || createPod.isPending}
        onClick={handleSubmit}
        type="button">
        Create pod
      </button>
      {status ? <p className="muted">{status}</p> : null}
    </section>
  );
}
