import { useEffect, useRef, useState } from 'react';
import '../styles/toast.css';

/**
 * ScoreToast — arcade-style popup that fires on each rally impact.
 *
 * Shows:  "Kudamii Nguyen  KILL!"   (or BLOCK / ACE / ERR)
 * Anim:   slides in from left (Team A) or right (Team B),
 *         holds 1.8s, fades out.
 *         Stacks if multiple fire in quick succession (max 2).
 */
export default function ScoreToast({ log = [] }) {
  const [toasts, setToasts] = useState([]);
  const prevLogLen = useRef(0);

  useEffect(() => {
    if (log.length > prevLogLen.current) {
      const newEntry = log[0]; // newest = index 0
      prevLogLen.current = log.length;
      const id = newEntry.id;

      setToasts((prev) => {
        const next = [{ ...newEntry, toastId: id }, ...prev].slice(0, 2);
        return next;
      });

      // Remove after animation completes
      const tid = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.toastId !== id));
      }, 2400);
      return () => clearTimeout(tid);
    } else {
      prevLogLen.current = log.length;
    }
  }, [log]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="assertive">
      {toasts.map((t) => (
        <Toast key={t.toastId} entry={t} />
      ))}
    </div>
  );
}

function Toast({ entry }) {
  const { scorer, pointType, side } = entry;
  const isA = side === 'A';

  const emoji = {
    KILL:          '💥',
    BLOCK:         '🛡️',
    ACE:           '⚡',
    ATTACK_ERR:    '❌',
    SERVICE_ERR:   '💨',
  }[pointType] || '●';

  return (
    <div
      className={`toast toast--${isA ? 'a' : 'b'} toast--${(pointType || 'kill').toLowerCase()}`}
      role="status"
    >
      <span className="toast__team">{isA ? 'TEAM A' : 'TEAM B'}</span>
      <span className="toast__scorer">{scorer || '—'}</span>
      <span className="toast__divider" aria-hidden="true">·</span>
      <span className="toast__type">{pointType || 'KILL'}</span>
      <span className="toast__bang" aria-hidden="true">!</span>
    </div>
  );
}
