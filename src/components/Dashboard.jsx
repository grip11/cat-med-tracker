import { useState } from 'react'
import MedCard from './MedCard.jsx'

export default function Dashboard({
  cat, medications, logs,
  onUpdateCat, onAddMed, onEditMed, onDeleteMed, onLogDose, onViewHistory,
}) {
  const [editingProfile, setEditingProfile] = useState(false)
  const [draft, setDraft] = useState(cat)

  function saveProfile() {
    onUpdateCat(draft)
    setEditingProfile(false)
  }

  const todayLogs = logs.filter(l => {
    const d = new Date(l.timestamp)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })

  const dueSoon = medications.filter(med => {
    if (!med.frequency) return false
    const lastLog = logs
      .filter(l => l.med_id === med.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
    if (!lastLog) return true
    const hoursSince = (Date.now() - new Date(lastLog.timestamp)) / 3600000
    const freqHours = { daily: 24, twice_daily: 12, weekly: 168, as_needed: null }
    const threshold = freqHours[med.frequency]
    if (!threshold) return false
    return hoursSince >= threshold * 0.85
  })

  return (
    <div style={{ paddingTop: '1.75rem' }}>
      {/* Cat profile card */}
      <div style={{
        background: 'var(--ink)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        marginBottom: '1.75rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -20,
          fontSize: 100, opacity: 0.08, lineHeight: 1, pointerEvents: 'none',
          userSelect: 'none',
        }}>🐱</div>

        {!editingProfile ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                color: 'var(--cream)',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: 6,
              }}>
                {cat.name || 'My Cat'}
              </h1>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {cat.breed && <ProfileDetail label="Breed" value={cat.breed} />}
                {cat.age && <ProfileDetail label="Age" value={cat.age} />}
                {cat.weight && <ProfileDetail label="Weight" value={cat.weight} />}
              </div>
              {!cat.breed && !cat.age && !cat.weight && (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>
                  Add your cat's details →
                </p>
              )}
            </div>
            <button
              onClick={() => { setDraft(cat); setEditingProfile(true) }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                fontSize: 12,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                flexShrink: 0,
              }}
            >
              Edit
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--ink-light)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
              Edit Profile
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 14 }}>
              {[
                { key: 'name', label: 'Name', placeholder: 'e.g. Luna' },
                { key: 'breed', label: 'Breed', placeholder: 'e.g. Tabby' },
                { key: 'age', label: 'Age', placeholder: 'e.g. 3 years' },
                { key: 'weight', label: 'Weight', placeholder: 'e.g. 4.2 kg' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {f.label}
                  </label>
                  <input
                    value={draft[f.key] || ''}
                    onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%', padding: '7px 10px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff', fontSize: 14,
                    }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={saveProfile} style={{
                background: 'var(--terracotta)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-sm)',
                padding: '7px 16px', fontSize: 13, fontFamily: 'var(--font-body)', cursor: 'pointer', fontWeight: 500,
              }}>Save</button>
              <button onClick={() => setEditingProfile(false)} style={{
                background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)',
                padding: '7px 16px', fontSize: 13, fontFamily: 'var(--font-body)', cursor: 'pointer',
              }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Stats row */}
        {!editingProfile && (
          <div style={{
            display: 'flex', gap: 10, marginTop: 20, paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
            <StatPill value={medications.length} label="medications" />
            <StatPill value={todayLogs.length} label="doses today" highlight />
            <StatPill value={dueSoon.length} label="due soon" warn={dueSoon.length > 0} />
          </div>
        )}
      </div>

      {/* Medications section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.02em' }}>
          Medications
        </h2>
        {logs.length > 0 && (
          <button
            onClick={onViewHistory}
            style={{
              background: 'none', border: 'none',
              color: 'var(--terracotta)', fontSize: 13, fontFamily: 'var(--font-body)',
              cursor: 'pointer', fontWeight: 500,
            }}
          >
            View history →
          </button>
        )}
      </div>

      {medications.length === 0 ? (
        <EmptyState onAdd={onAddMed} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {medications.map(med => (
            <MedCard
              key={med.id}
              med={med}
              logs={logs.filter(l => l.med_id === med.id)}
              onLog={() => onLogDose(med)}
              onEdit={() => onEditMed(med)}
              onDelete={() => onDeleteMed(med.id)}
            />
          ))}
          <button
            onClick={onAddMed}
            style={{
              background: 'none',
              border: '2px dashed var(--cream-dark)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              color: 'var(--ink-light)',
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              marginTop: 4,
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = 'var(--terracotta-light)'
              e.target.style.color = 'var(--terracotta)'
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = 'var(--cream-dark)'
              e.target.style.color = 'var(--ink-light)'
            }}
          >
            + Add another medication
          </button>
        </div>
      )}
    </div>
  )
}

function ProfileDetail({ label, value }) {
  return (
    <div>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label} </span>
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function StatPill({ value, label, highlight, warn }) {
  return (
    <div style={{
      background: warn ? 'rgba(210,100,54,0.2)' : highlight ? 'rgba(74,124,89,0.2)' : 'rgba(255,255,255,0.08)',
      borderRadius: 'var(--radius-sm)',
      padding: '6px 12px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: warn ? 'var(--terracotta-light)' : highlight ? '#9FDDBC' : 'var(--cream)', lineHeight: 1.2 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 2rem',
      background: 'var(--cream-dark)',
      borderRadius: 'var(--radius-xl)',
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>💊</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>
        No medications yet
      </h3>
      <p style={{ color: 'var(--ink-muted)', fontSize: 14, marginBottom: 20 }}>
        Add your cat's first medication to get started.
      </p>
      <button
        onClick={onAdd}
        style={{
          background: 'var(--terracotta)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 24px',
          fontSize: 14,
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Add Medication
      </button>
    </div>
  )
}
