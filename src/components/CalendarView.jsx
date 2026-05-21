import { useState } from 'react'

const FREQ_LABELS = {
  daily: 'Once daily',
  twice_daily: 'Twice daily',
  weekly: 'Weekly',
  as_needed: 'As needed',
}

const MED_COLORS = [
  { bg: '#EDCFC3', text: '#8C3E23', dot: '#C25A36' },
  { bg: '#C8DDD0', text: '#2E5038', dot: '#4A7C59' },
  { bg: '#F5E4B5', text: '#8A5E05', dot: '#D4900A' },
  { bg: '#E4E8EC', text: '#2C3438', dot: '#5A6670' },
  { bg: '#F4C0D1', text: '#72243E', dot: '#D4537E' },
  { bg: '#B5D4F4', text: '#0C447C', dot: '#378ADD' },
]

export default function CalendarView({ medications, logs }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)

  const medColorMap = {}
  medications.forEach((med, i) => {
    medColorMap[med.id] = MED_COLORS[i % MED_COLORS.length]
  })

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long' })
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Build a map of day -> logs for this month
  const logsByDay = {}
  logs.forEach(log => {
    const d = new Date(log.timestamp)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!logsByDay[day]) logsByDay[day] = []
      logsByDay[day].push(log)
    }
  })

  // Logs for selected day
  const selectedLogs = selectedDay ? (logsByDay[selectedDay] || []) : []

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  // Build calendar grid (pad with nulls for leading empty cells)
  const cells = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div style={{ paddingTop: '1.75rem' }}>
      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.03em' }}>
          {monthName} {year}
        </h2>
        <div style={{ display: 'flex', gap: 6 }}>
          <NavArrow onClick={prevMonth}>←</NavArrow>
          <NavArrow onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); setSelectedDay(null) }}>
            Today
          </NavArrow>
          <NavArrow onClick={nextMonth}>→</NavArrow>
        </div>
      </div>

      {/* Legend */}
      {medications.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {medications.map(med => {
            const c = medColorMap[med.id]
            return (
              <div key={med.id} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: c.bg, borderRadius: 20,
                padding: '3px 10px',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: c.text }}>
                  {med.name}
                  {med.dosage ? ` · ${med.dosage}` : ''}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 3 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--ink-light)', padding: '4px 0',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const dayLogs = logsByDay[day] || []
          const selected = selectedDay === day
          const todayCell = isToday(day)

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(selected ? null : day)}
              style={{
                background: selected ? 'var(--ink)' : todayCell ? 'var(--cream-dark)' : '#fff',
                border: todayCell && !selected
                  ? '2px solid var(--ink)'
                  : selected ? '2px solid var(--ink)'
                  : '1px solid var(--cream-dark)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 4px',
                minHeight: 64,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.1s',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <span style={{
                fontSize: 13, fontWeight: todayCell ? 700 : 400,
                color: selected ? 'var(--cream)' : todayCell ? 'var(--ink)' : 'var(--ink-muted)',
                padding: '0 2px',
              }}>
                {day}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {dayLogs.slice(0, 3).map(log => {
                  const c = medColorMap[log.med_id] || MED_COLORS[0]
                  const med = medications.find(m => m.id === log.med_id)
                  return (
                    <div key={log.id} style={{
                      background: selected ? 'rgba(255,255,255,0.15)' : c.bg,
                      borderRadius: 3,
                      padding: '1px 4px',
                      fontSize: 10,
                      fontWeight: 500,
                      color: selected ? '#fff' : c.text,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {med ? med.name : '—'}
                    </div>
                  )
                })}
                {dayLogs.length > 3 && (
                  <div style={{ fontSize: 10, color: selected ? 'rgba(255,255,255,0.6)' : 'var(--ink-light)', padding: '0 4px' }}>
                    +{dayLogs.length - 3} more
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected day detail panel */}
      {selectedDay && (
        <div style={{
          marginTop: '1.25rem',
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--cream-dark)',
          overflow: 'hidden',
        }}>
          <div style={{
            background: 'var(--ink)', padding: '0.875rem 1.25rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--cream)', letterSpacing: '-0.02em' }}>
              {monthName} {selectedDay}, {year}
            </h3>
            <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>
              {selectedLogs.length} dose{selectedLogs.length !== 1 ? 's' : ''}
            </span>
          </div>

          {selectedLogs.length === 0 ? (
            <p style={{ padding: '1.25rem', color: 'var(--ink-light)', fontSize: 14, fontStyle: 'italic' }}>
              No doses logged on this day.
            </p>
          ) : (
            <div style={{ padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedLogs
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .map(log => {
                  const med = medications.find(m => m.id === log.med_id)
                  const c = medColorMap[log.med_id] || MED_COLORS[0]
                  const time = new Date(log.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: '2-digit', hour12: true,
                  })
                  return (
                    <div key={log.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '0.625rem 0',
                      borderBottom: '1px solid var(--cream-dark)',
                    }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: c.dot, marginTop: 4, flexShrink: 0,
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            {med ? med.name : <span style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}>Deleted med</span>}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>{time}</span>
                        </div>
                        {med?.dosage && (
                          <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{med.dosage}</span>
                        )}
                        {log.note && (
                          <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2, fontStyle: 'italic' }}>
                            "{log.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {medications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-light)', fontSize: 14 }}>
          Add medications first to see them on the calendar.
        </div>
      )}
    </div>
  )
}

function NavArrow({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: '1px solid var(--cream-dark)',
        borderRadius: 'var(--radius-sm)',
        padding: '5px 12px',
        fontSize: 13, fontFamily: 'var(--font-body)',
        color: 'var(--ink-muted)', cursor: 'pointer',
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  )
}
