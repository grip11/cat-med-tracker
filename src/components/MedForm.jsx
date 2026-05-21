import { useState } from 'react'

const FREQUENCIES = [
  { value: 'daily', label: 'Once daily' },
  { value: 'twice_daily', label: 'Twice daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'as_needed', label: 'As needed' },
]

export default function MedForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    prescribedBy: '',
    startDate: '',
    endDate: '',
    notes: '',
    ...initial,
  })
  const [errors, setErrors] = useState({})

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Medication name is required'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave(form)
  }

  return (
    <div style={{ paddingTop: '1.75rem', maxWidth: 560 }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 26, letterSpacing: '-0.03em',
        marginBottom: '1.5rem',
      }}>
        {initial ? 'Edit medication' : 'Add medication'}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Field label="Medication name *" error={errors.name}>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Prednisolone, Metacam"
            style={inputStyle(errors.name)}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="Dosage">
            <input
              value={form.dosage}
              onChange={e => set('dosage', e.target.value)}
              placeholder="e.g. 5mg, 0.5ml"
              style={inputStyle()}
            />
          </Field>

          <Field label="Frequency">
            <select
              value={form.frequency}
              onChange={e => set('frequency', e.target.value)}
              style={{ ...inputStyle(), background: '#fff' }}
            >
              {FREQUENCIES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Prescribed by">
          <input
            value={form.prescribedBy}
            onChange={e => set('prescribedBy', e.target.value)}
            placeholder="e.g. Dr. Smith"
            style={inputStyle()}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="Start date">
            <input
              type="date"
              value={form.startDate}
              onChange={e => set('startDate', e.target.value)}
              style={inputStyle()}
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              value={form.endDate}
              onChange={e => set('endDate', e.target.value)}
              style={inputStyle()}
            />
          </Field>
        </div>

        <Field label="Notes">
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Instructions, side effects to watch for, etc."
            rows={3}
            style={{
              ...inputStyle(),
              resize: 'vertical',
              lineHeight: 1.5,
            }}
          />
        </Field>

        <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
          <button
            onClick={handleSubmit}
            style={{
              background: 'var(--ink)',
              color: 'var(--cream)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 28px',
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {initial ? 'Save changes' : 'Add medication'}
          </button>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              color: 'var(--ink-muted)',
              border: '1px solid var(--cream-dark)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 20px',
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children, error }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 12,
        fontWeight: 600, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: 'var(--ink-muted)',
        marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{error}</p>
      )}
    </div>
  )
}

function inputStyle(error) {
  return {
    width: '100%',
    padding: '9px 12px',
    background: '#fff',
    border: `1px solid ${error ? 'var(--danger)' : 'var(--cream-dark)'}`,
    borderRadius: 'var(--radius-sm)',
    fontSize: 15,
    color: 'var(--ink)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }
}
