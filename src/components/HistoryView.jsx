export default function HistoryView({ medications, logs, onDeleteLog, onBack }) {
  const sorted = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  function getMed(id) {
    return medications.find(m => m.id === id)
  }

  function formatDateTime(iso) {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    })
  }

  // Group by date
  const grouped = {}
  sorted.forEach(log => {
    const day = new Date(log.timestamp).toDateString()
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(log)
  })

  return (
    <div style={{ paddingTop: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.03em' }}>
          Dose history
        </h2>
        <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>
          {logs.length} dose{logs.length !== 1 ? 's' : ''} total
        </span>
      </div>

      {logs.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem',
          background: 'var(--cream-dark)', borderRadius: 'var(--radius-xl)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p style={{ color: 'var(--ink-muted)', fontSize: 15 }}>No doses logged yet.</p>
        </div>
      ) : (
        <div>
          {Object.entries(grouped).map(([day, dayLogs]) => (
            <div key={day} style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--ink-light)',
                marginBottom: 8,
              }}>
                {formatDay(day)}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dayLogs.map(log => {
                  const med = getMed(log.med_id)
                  return (
                    <div
                      key={log.id}
                      style={{
                        background: '#fff',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--cream-dark)',
                        padding: '0.875rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            {med ? med.name : <span style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}>Deleted med</span>}
                          </span>
                          {med?.dosage && (
                            <span style={{
                              fontSize: 11, color: 'var(--ink-muted)',
                              background: 'var(--cream)', borderRadius: 20,
                              padding: '1px 7px', border: '1px solid var(--cream-dark)',
                            }}>
                              {med.dosage}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>
                          {formatDateTime(log.timestamp)}
                        </div>
                        {log.note && (
                          <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4, fontStyle: 'italic' }}>
                            "{log.note}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        title="Remove log"
                        style={{
                          background: 'none', border: 'none',
                          color: 'var(--ink-light)', fontSize: 16,
                          cursor: 'pointer', padding: '4px 6px',
                          flexShrink: 0, borderRadius: 'var(--radius-sm)',
                          transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => e.target.style.color = 'var(--danger)'}
                        onMouseLeave={e => e.target.style.color = 'var(--ink-light)'}
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDay(dayString) {
  const d = new Date(dayString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
