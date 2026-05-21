import { useState, useEffect, useRef } from 'react'

const VIEW_LABELS = {
  dashboard: 'Home',
  calendar: 'Calendar',
  history: 'History',
  addMed: 'Add Medication',
}

export default function Header({ catName, view, setView, onAddMed, cancelForm, onRefresh, refreshing }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const isSubView = view !== 'dashboard'

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  // Close menu when view changes
  useEffect(() => { setMenuOpen(false) }, [view])

  function goHome() {
    cancelForm()
    setView('dashboard')
  }

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes menuSlideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .menu-item:active { transform: scale(0.97); background: rgba(255,255,255,0.08) !important; }
      `}</style>

      <header style={{
        background: 'var(--ink)',
        padding: '0 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}>
        <div style={{
          maxWidth: 760,
          margin: '0 auto',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* Left: logo / back button */}
          {isSubView ? (
            <button
              onClick={goHome}
              style={{
                background: 'none', border: 'none',
                display: 'flex', alignItems: 'center', gap: 6,
                color: 'rgba(255,255,255,0.75)', fontSize: 15,
                fontFamily: 'var(--font-body)', cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
              <span>{VIEW_LABELS[view] || 'Back'}</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>🐱</span>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 17,
                  color: 'var(--cream)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}>
                  {catName || 'My Cat'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Med Tracker
                </div>
              </div>
            </div>
          )}

          {/* Right: actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} ref={menuRef}>

            {/* Refresh — only on dashboard */}
            {!isSubView && (
              <button
                onClick={onRefresh}
                title="Refresh"
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 18, cursor: 'pointer',
                  animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
                  flexShrink: 0,
                }}
              >
                ↻
              </button>
            )}

            {/* Add med — only on dashboard */}
            {!isSubView && (
              <button
                onClick={onAddMed}
                style={{
                  background: 'var(--terracotta)',
                  border: 'none',
                  borderRadius: 8,
                  height: 36,
                  padding: '0 14px',
                  color: '#fff',
                  fontSize: 13, fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                + Add
              </button>
            )}

            {/* Hamburger — only on dashboard */}
            {!isSubView && (
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  background: menuOpen ? 'rgba(255,255,255,0.12)' : 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  width: 36, height: 36,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 4, cursor: 'pointer',
                  transition: 'background 0.15s',
                  flexShrink: 0,
                }}
                aria-label="Menu"
              >
                {/* Animated hamburger → X */}
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    display: 'block',
                    width: 16, height: 1.5,
                    background: 'rgba(255,255,255,0.75)',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    transformOrigin: 'center',
                    transform: menuOpen
                      ? i === 0 ? 'translateY(5.5px) rotate(45deg)'
                      : i === 2 ? 'translateY(-5.5px) rotate(-45deg)'
                      : 'scaleX(0) opacity(0)'
                      : 'none',
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }} />
                ))}
              </button>
            )}

            {/* Dropdown menu */}
            {menuOpen && (
              <div style={{
                position: 'absolute',
                top: 56,
                right: '1.25rem',
                width: 200,
                background: '#1a1612',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14,
                overflow: 'hidden',
                zIndex: 300,
                animation: 'menuSlideIn 0.18s ease',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                {[
                  { label: 'Home', icon: '🏠', target: 'dashboard' },
                  { label: 'Calendar', icon: '📅', target: 'calendar' },
                  { label: 'History', icon: '📋', target: 'history' },
                ].map((item, i, arr) => (
                  <button
                    key={item.target}
                    className="menu-item"
                    onClick={() => { setView(item.target); setMenuOpen(false) }}
                    style={{
                      width: '100%',
                      background: view === item.target ? 'rgba(255,255,255,0.1)' : 'transparent',
                      border: 'none',
                      borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                      padding: '13px 16px',
                      display: 'flex', alignItems: 'center', gap: 12,
                      color: view === item.target ? '#fff' : 'rgba(255,255,255,0.7)',
                      fontSize: 15,
                      fontFamily: 'var(--font-body)',
                      fontWeight: view === item.target ? 500 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.1s',
                    }}
                  >
                    <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                    {view === item.target && (
                      <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.5 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tap-outside overlay (mobile friendly) */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 150,
            animation: 'overlayIn 0.15s ease',
          }}
        />
      )}
    </>
  )
}
