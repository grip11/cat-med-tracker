import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase.js'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import MedForm from './components/MedForm.jsx'
import LogModal from './components/LogModal.jsx'
import HistoryView from './components/HistoryView.jsx'
import CalendarView from './components/CalendarView.jsx'

const CAT_ID = 'harold'
const defaultCat = { name: 'Harold (meestor evil)', age: '', weight: '', breed: '' }

function toSnakeCase(med) {
  return {
    name: med.name,
    dosage: med.dosage || '',
    frequency: med.frequency || '',
    notes: med.notes || '',
    prescribed_by: med.prescribedBy || med.prescribed_by || '',
    start_date: med.startDate || med.start_date || '',
    end_date: med.endDate || med.end_date || '',
  }
}

function toCamelCase(med) {
  return {
    ...med,
    prescribedBy: med.prescribed_by || '',
    startDate: med.start_date || '',
    endDate: med.end_date || '',
  }
}

export default function App() {
  const [cat, setCat] = useState(defaultCat)
  const [medications, setMedications] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [view, setView] = useState('dashboard')
  const [editingMed, setEditingMed] = useState(null)
  const [loggingMed, setLoggingMed] = useState(null)

  const loadAll = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true)
    else setLoading(true)
    const [catRes, medsRes, logsRes] = await Promise.all([
      supabase.from('cat_profile').select('*').eq('id', CAT_ID).single(),
      supabase.from('medications').select('*').order('created_at', { ascending: true }),
      supabase.from('dose_logs').select('*').order('timestamp', { ascending: false }),
    ])
    if (catRes.data) setCat(catRes.data)
    if (medsRes.data) setMedications(medsRes.data.map(toCamelCase))
    if (logsRes.data) setLogs(logsRes.data)
    if (quiet) setRefreshing(false)
    else setLoading(false)
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  function handleRefresh() { loadAll(true) }

  async function updateCat(updated) {
    setCat(updated)
    await supabase.from('cat_profile').upsert({ ...updated, id: CAT_ID })
  }

  async function saveMed(med) {
    if (editingMed) {
      const { data, error } = await supabase
        .from('medications').update(toSnakeCase(med)).eq('id', med.id).select().single()
      if (error) { console.error(error); return }
      if (data) setMedications(ms => ms.map(m => m.id === data.id ? toCamelCase(data) : m))
      setEditingMed(null)
    } else {
      const { data, error } = await supabase
        .from('medications').insert(toSnakeCase(med)).select().single()
      if (error) { console.error(error); return }
      if (data) setMedications(ms => [...ms, toCamelCase(data)])
    }
    setView('dashboard')
  }

  async function deleteMed(id) {
    await supabase.from('medications').delete().eq('id', id)
    await supabase.from('dose_logs').delete().eq('med_id', id)
    setMedications(ms => ms.filter(m => m.id !== id))
    setLogs(ls => ls.filter(l => l.med_id !== id))
  }

  async function logDose(medId, note, timestamp) {
    const { data, error } = await supabase
      .from('dose_logs')
      .insert({ med_id: medId, timestamp: timestamp || new Date().toISOString(), note: note || '' })
      .select().single()
    if (error) { console.error(error); return }
    if (data) setLogs(ls => [data, ...ls])
    setLoggingMed(null)
  }

  async function deleteLog(logId) {
    await supabase.from('dose_logs').delete().eq('id', logId)
    setLogs(ls => ls.filter(l => l.id !== logId))
  }

  function startEdit(med) { setEditingMed(med); setView('addMed') }
  function startAdd() { setEditingMed(null); setView('addMed') }
  function cancelForm() { setEditingMed(null); setView('dashboard') }

  if (loading) return <LoadingScreen />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Header
        catName={cat.name}
        view={view}
        setView={setView}
        onAddMed={startAdd}
        cancelForm={cancelForm}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.25rem 4rem' }}>
        {view === 'dashboard' && (
          <Dashboard
            cat={cat}
            medications={medications}
            logs={logs}
            onUpdateCat={updateCat}
            onAddMed={startAdd}
            onEditMed={startEdit}
            onDeleteMed={deleteMed}
            onLogDose={setLoggingMed}
            onViewHistory={() => setView('history')}
          />
        )}
        {view === 'addMed' && (
          <MedForm initial={editingMed} onSave={saveMed} onCancel={cancelForm} />
        )}
        {view === 'history' && (
          <HistoryView
            medications={medications}
            logs={logs}
            onDeleteLog={deleteLog}
            onBack={() => setView('dashboard')}
          />
        )}
        {view === 'calendar' && (
          <CalendarView
            medications={medications}
            logs={logs}
          />
        )}
      </main>
      {loggingMed && (
        <LogModal med={loggingMed} onLog={logDose} onClose={() => setLoggingMed(null)} />
      )}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cream)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>🐱</div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-muted)' }}>
        Loading Harold's data…
      </p>
    </div>
  )
}
