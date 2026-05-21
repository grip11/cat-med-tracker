export default function Header({ catName, view, setView, onAddMed, cancelForm, onRefresh, refreshing }) {
  return (
    <header style={{
      background: 'var(--ink)',
      padding: '0 1.25rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 760,
        margin: '0 auto',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={() => { if (view !== 'dashboard') { cancelForm(); setView('dashboard') } }}
          style={{
            background: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: view !== 'dashboard' ? 'pointer' : 'default',
          }}
        >
          <span style={{ fontSize: 24 }}>🐱</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              color: 'var(--cream)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              {catName || 'My Cat'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-light)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Med Tracker
            </div>
          </div>
        </button>

        <nav style={{ display: 'flex', gap: 6 }}>
          {view === 'dashboard' && (
            <>
              <NavBtn onClick={onRefresh} title="Refresh" spin={refreshing}>
                {refreshing ? '⟳' : '↻'}
              </NavBtn>
              <NavBtn onClick={() => setView('calendar')}>Calendar</NavBtn>
              <NavBtn onClick={() => setView('history')}>History</NavBtn>
              <NavBtn onClick={onAddMed} primary>+ Add Med</NavBtn>
            </>
          )}
          {view === 'history' && (
            <NavBtn onClick={() => setView('dashboard')}>← Back</NavBtn>
          )}
          {view === 'calendar' && (
            <NavBtn onClick={() => setView('dashboard')}>← Back</NavBtn>
          )}
          {view === 'addMed' && (
            <NavBtn onClick={cancelForm}>← Cancel</NavBtn>
          )}
        </nav>
      </div>
    </header>
  )
}

function NavBtn({ children, onClick, active, primary, title, spin }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        padding: '6px 14px',
        borderRadius: 'var(--radius-sm)',
        fontSize: spin ? 18 : 13,
        fontWeight: 500,
        fontFamily: 'var(--font-body)',
        background: primary ? 'var(--terracotta)' : active ? 'rgba(255,255,255,0.15)' : 'transparent',
        color: primary ? '#fff' : 'rgba(255,255,255,0.75)',
        border: primary ? 'none' : '1px solid rgba(255,255,255,0.15)',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        letterSpacing: '0.01em',
        animation: spin ? 'spin 0.8s linear infinite' : 'none',
      }}
    >
      {children}
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </button>
  )
}
