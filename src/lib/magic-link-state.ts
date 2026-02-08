const STORAGE_KEY = 'gatherer.pending_magic_link_email';

let pendingMagicLinkEmail: string | null = null;

function readStoredEmail() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredEmail(email: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (email) {
      window.localStorage.setItem(STORAGE_KEY, email);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // no-op
  }
}

export function setPendingMagicLinkEmail(email: string) {
  pendingMagicLinkEmail = email.trim().toLowerCase();
  writeStoredEmail(pendingMagicLinkEmail);
}

export function getPendingMagicLinkEmail() {
  if (pendingMagicLinkEmail) return pendingMagicLinkEmail;
  pendingMagicLinkEmail = readStoredEmail();
  return pendingMagicLinkEmail;
}

export function clearPendingMagicLinkEmail() {
  pendingMagicLinkEmail = null;
  writeStoredEmail(null);
}
