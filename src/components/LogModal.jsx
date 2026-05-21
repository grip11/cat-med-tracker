import { useState } from 'react'

export default function LogModal({ med, onLog, onClose }) {
  const [note, setNote] = useState('')
  const [customTime, setCustomTime] = useState(false)
  const [timestamp, setTimestamp] = useState(
    new Date().toISOString().slice(0, 16)
  )

  function handleLog() {
    onLog(med.id, note.trim(), customTime ? new Date(timestamp).toISOString() : null)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(28,22,18,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        width: '100%',
        maxWidth: 400,
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 4 }}>
            Log dose
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '-0.02em' }}>
            {med.name}
          </h2>
          {med.dosage && (
            <p style={{ fontSize: 14, color: 'var(--ink-muted)', marginTop: 2 }}>{med.dosage}</p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-muted)', cursor: 'pointer', marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={customTime}
              onChange={e => setCustomTime(e.target.checked)}
              style={{ width: 14, height: 14 }}
            />
            Set a different time
          </label>

          {customTime && (
            <input
              type="datetime-local"
              value={timestamp}
              onChange={e => setTimestamp(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px',
                border: '1px solid var(--cream-dark)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 14, color: 'var(--ink)',
                background: '#fff',
              }}
            />
          )}
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Gave with food, seemed to eat it all"
            rows={2}
            style={{
              width: '100%', padding: '8px 12px',
              border: '1px solid var(--cream-dark)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 14, color: 'var(--ink)',
              background: '#fff', resize: 'none', lineHeight: 1.5,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleLog}
            style={{
              flex: 1,
              background: 'var(--terracotta)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-sm)',
              padding: '11px', fontSize: 14,
              fontFamily: 'var(--font-body)', fontWeight: 500, cursor: 'pointer',
            }}
          >
            ✓ Mark as given
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none', color: 'var(--ink-muted)',
              border: '1px solid var(--cream-dark)', borderRadius: 'var(--radius-sm)',
              padding: '11px 16px', fontSize: 14,
              fontFamily: 'var(--font-body)', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
