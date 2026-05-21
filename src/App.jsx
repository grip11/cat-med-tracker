import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import MedForm from './components/MedForm.jsx'
import LogModal from './components/LogModal.jsx'
import HistoryView from './components/HistoryView.jsx'

const STORAGE_KEY = 'cat-med-tracker-v1'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const defaultState = {
  cat: { name: 'My Cat', age: '', weight: '', breed: '' },
  medications: [],
  logs: [],
}

export default function App() {
  const [data, setData] = useState(() => loadData() || defaultState)
  const [view, setView] = useState('dashboard') // dashboard | addMed | history
  const [editingMed, setEditingMed] = useState(null)
  const [loggingMed, setLoggingMed] = useState(null)

  useEffect(() => {
    saveData(data)
  }, [data])

  function updateCat(cat) {
    setData(d => ({ ...d, cat }))
  }

  function saveMed(med) {
    if (editingMed) {
      setData(d => ({
        ...d,
        medications: d.medications.map(m => m.id === med.id ? med : m),
      }))
      setEditingMed(null)
    } else {
      setData(d => ({
        ...d,
        medications: [...d.medications, { ...med, id: crypto.randomUUID() }],
      }))
    }
    setView('dashboard')
  }

  function deleteMed(id) {
    setData(d => ({
      ...d,
      medications: d.medications.filter(m => m.id !== id),
      logs: d.logs.filter(l => l.medId !== id),
    }))
  }

  function logDose(medId, note, timestamp) {
    setData(d => ({
      ...d,
      logs: [...d.logs, {
        id: crypto.randomUUID(),
        medId,
        timestamp: timestamp || new Date().toISOString(),
        note: note || '',
      }],
    }))
    setLoggingMed(null)
  }

  function deleteLog(logId) {
    setData(d => ({ ...d, logs: d.logs.filter(l => l.id !== logId) }))
  }

  function startEdit(med) {
    setEditingMed(med)
    setView('addMed')
  }

  function startAdd() {
    setEditingMed(null)
    setView('addMed')
  }

  function cancelForm() {
    setEditingMed(null)
    setView('dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Header
        catName={data.cat.name}
        view={view}
        setView={setView}
        onAddMed={startAdd}
        cancelForm={cancelForm}
      />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.25rem 4rem' }}>
        {view === 'dashboard' && (
          <Dashboard
            cat={data.cat}
            medications={data.medications}
            logs={data.logs}
            onUpdateCat={updateCat}
            onAddMed={startAdd}
            onEditMed={startEdit}
            onDeleteMed={deleteMed}
            onLogDose={setLoggingMed}
            onViewHistory={() => setView('history')}
          />
        )}

        {view === 'addMed' && (
          <MedForm
            initial={editingMed}
            onSave={saveMed}
            onCancel={cancelForm}
          />
        )}

        {view === 'history' && (
          <HistoryView
            medications={data.medications}
            logs={data.logs}
            onDeleteLog={deleteLog}
            onBack={() => setView('dashboard')}
          />
        )}
      </main>

      {loggingMed && (
        <LogModal
          med={loggingMed}
          onLog={logDose}
          onClose={() => setLoggingMed(null)}
        />
      )}
    </div>
  )
}
