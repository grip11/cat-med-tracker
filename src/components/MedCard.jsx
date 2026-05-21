import { useState } from 'react'

const FREQ_LABELS = {
  daily: 'Once daily',
  twice_daily: 'Twice daily',
  weekly: 'Weekly',
  as_needed: 'As needed',
}

const FREQ_HOURS = { daily: 24, twice_daily: 12, weekly: 168, as_needed: null }

export default function MedCard({ med, logs, onLog, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const lastLog = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
  const hoursSinceLast = lastLog
    ? (Date.now() - new Date(lastLog.timestamp)) / 3600000
    : null

  const thresholdHrs = FREQ_HOURS[med.frequency]
  let status = 'ok'
  if (!lastLog) {
    status = 'due'
  } else if (thresholdHrs) {
    if (hoursSinceLast >= thresholdHrs) status = 'overdue'
    else if (hoursSinceLast >= thresholdHrs * 0.85) status = 'due'
  }

  const statusStyles = {
    ok:      { bg: 'var(--sage-light)',         text: 'var(--sage-dark)',         label: 'On track' },
    due:     { bg: 'var(--amber-light)',         text: 'var(--amber-dark)',        label: 'Due soon' },
    overdue: { bg: 'var(--terracotta-light)',    text: 'var(--terracotta-dark)',   label: 'Overdue' },
  }
  const s = statusStyles[status]

  function formatRelativeTime(isoString) {
    const diff = (Date.now() - new Date(isoString)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--cream-dark)',
      overflow: 'hidden',
      transition: 'box-shadow 0.15s',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Colored top accent */}
      <div style={{ height: 4, background: status === 'overdue' ? 'var(--terracotta)' : status === 'due' ? 'var(--amber)' : 'var(--sage)' }} />

      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '-0.02em' }}>
                {med.name}
              </h3>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                background: s.bg, color: s.text,
                padding: '2px 8px', borderRadius: 20,
              }}>
                {s.label}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {med.dosage && <Detail icon="💊" text={med.dosage} />}
              {med.frequency && <Detail icon="🕐" text={FREQ_LABELS[med.frequency]} />}
              {med.prescribedBy && <Detail icon="👨‍⚕️" text={med.prescribedBy} />}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginLeft: 12, flexShrink: 0 }}>
            <IconBtn onClick={onEdit} title="Edit">✏️</IconBtn>
            {confirmDelete ? (
              <>
                <ConfirmBtn onClick={onDelete}>Delete?</ConfirmBtn>
                <ConfirmBtn onClick={() => setConfirmDelete(false)} cancel>No</ConfirmBtn>
              </>
            ) : (
              <IconBtn onClick={() => setConfirmDelete(true)} title="Delete">🗑️</IconBtn>
            )}
          </div>
        </div>

        {med.notes && (
          <p style={{
            fontSize: 13, color: 'var(--ink-muted)',
            background: 'var(--cream)', borderRadius: 'var(--radius-sm)',
            padding: '6px 10px', marginBottom: 10,
            borderLeft: '3px solid var(--cream-dark)',
            fontStyle: 'italic',
          }}>
            {med.notes}
          </p>
        )}

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 10, borderTop: '1px solid var(--cream-dark)',
        }}>
          <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>
            {lastLog
              ? <>Last given: <strong style={{ color: 'var(--ink-muted)' }}>{formatRelativeTime(lastLog.timestamp)}</strong></>
              : <span style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}>Never given</span>
            }
            {' · '}
            <span>{logs.length} dose{logs.length !== 1 ? 's' : ''} total</span>
          </div>

          <button
            onClick={onLog}
            style={{
              background: 'var(--terracotta)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 16px',
              fontSize: 13,
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ✓ Log dose
          </button>
        </div>
      </div>
    </div>
  )
}

function Detail({ icon, text }) {
  return (
    <span style={{ fontSize: 13, color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
      <span style={{ fontSize: 12 }}>{icon}</span> {text}
    </span>
  )
}

function IconBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'var(--cream)',
        border: '1px solid var(--cream-dark)',
        borderRadius: 'var(--radius-sm)',
        width: 30, height: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function ConfirmBtn({ onClick, children, cancel }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: cancel ? 'var(--cream)' : 'var(--danger-light)',
        border: `1px solid ${cancel ? 'var(--cream-dark)' : 'var(--danger)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '4px 8px',
        fontSize: 11, fontFamily: 'var(--font-body)',
        color: cancel ? 'var(--ink-muted)' : 'var(--danger)',
        cursor: 'pointer', fontWeight: 500,
      }}
    >
      {children}
    </button>
  )
}
