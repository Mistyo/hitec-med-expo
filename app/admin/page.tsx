'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Profile = {
  id: string
  full_name: string
  email: string
  institution: string
  year_of_study: string
  payment_status: string
  payment_method: string
  payment_screenshot_url: string
  id_card_url: string
  cnic: string
  whatsapp: string
  created_at: string
}

type Abstract = {
  id: string
  user_id: string
  file_url: string
  file_name: string
  status: string
  submitted_at: string
  profiles: Profile
}

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState<'payments' | 'abstracts'>('payments')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [abstracts, setAbstracts] = useState<Abstract[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    checkAdminAndLoad()
  }, [])

  const checkAdminAndLoad = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('User:', user, 'Error:', userError)
    if (!user) { router.push('/login'); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') { router.push('/dashboard'); return }
    await loadData()
  }

  const loadData = async () => {
    setLoading(true)
    const [profilesRes, abstractsRes] = await Promise.all([
      fetch('/api/admin/profiles').then(r => r.json()),
      fetch('/api/admin/abstracts').then(r => r.json()),
    ])
    setProfiles(profilesRes.data || [])
    setAbstracts(abstractsRes.data || [])
    setLoading(false)
  }

  const verifyPayment = async (userId: string) => {
    setActionLoading(userId)
    const res = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    const data = await res.json()
    console.log('Verify response:', res.status, data)
    if (res.ok) await loadData()
    setActionLoading(null)
  }

  const rejectPayment = async (userId: string) => {
    setActionLoading(userId + '-reject')
    const res = await fetch('/api/reject-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    if (res.ok) await loadData()
    setActionLoading(null)
  }

  const updateAbstractStatus = async (abstractId: string, status: 'approved' | 'rejected') => {
    setActionLoading(abstractId)
    await supabase
      .from('abstracts')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', abstractId)
    await loadData()
    setActionLoading(null)
  }

  const stats = {
    total: profiles.length,
    verified: profiles.filter(p => p.payment_status === 'verified').length,
    pending: profiles.filter(p => p.payment_status === 'pending_verification').length,
    abstracts: abstracts.length,
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      verified:             { bg: '#e8f5e2', color: '#0d5e2e', label: 'Verified' },
      pending_verification: { bg: '#fef9e7', color: '#a07000', label: 'Pending' },
      unpaid:               { bg: '#fdecea', color: '#a02020', label: 'Unpaid' },
      approved:             { bg: '#e8f5e2', color: '#0d5e2e', label: 'Approved' },
      rejected:             { bg: '#fdecea', color: '#a02020', label: 'Rejected' },
      pending:              { bg: '#fef9e7', color: '#a07000', label: 'Pending' },
    }
    const s = styles[status] || styles.pending
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>
        {s.label}
      </span>
    )
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f7eb' }}>
      <p style={{ color: '#0d5e2e', fontSize: '14px' }}>Loading admin panel...</p>
    </div>
  )

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .admin-table-wrap { display: none !important; }
          .admin-cards-wrap { display: block !important; }
          .admin-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .admin-wrap { padding: 1rem !important; }
        }
        @media (min-width: 769px) {
          .admin-cards-wrap { display: none !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f8faf6' }}>
        <nav style={{ background: '#0d5e2e', padding: '0 1.25rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: '600' }}>
            HITEC Med Expo · Admin
          </span>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
            style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.5)', color: '#fff', padding: '7px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </nav>

        <div className="admin-wrap" style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>

          <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Registered', val: stats.total, color: '#0d5e2e' },
              { label: 'Payment Verified', val: stats.verified, color: '#0d5e2e' },
              { label: 'Pending Verification', val: stats.pending, color: '#a07000' },
              { label: 'Abstracts Submitted', val: stats.abstracts, color: '#0d5e2e' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '10px', padding: '1rem' }}>
                <p style={{ fontSize: '11px', color: '#6b8c6b', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</p>
                <p style={{ fontSize: '26px', fontWeight: '600', color: s.color, marginTop: '4px' }}>{s.val}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #d4e8cc', marginBottom: '1.5rem' }}>
            {(['payments', 'abstracts'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #0d5e2e' : '2px solid transparent', color: tab === t ? '#0d5e2e' : '#6b8c6b', fontWeight: tab === t ? '600' : '400', fontSize: '14px', cursor: 'pointer' }}
              >
                {t === 'payments' ? 'Payment Verifications' : 'Abstract Reviews'}
              </button>
            ))}
          </div>

          {tab === 'payments' && (
            <>
              <div className="admin-table-wrap" style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '12px', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '900px' }}>
                  <thead>
                    <tr style={{ background: '#f0f7eb' }}>
                      {['Name', 'Email', 'Institution', 'Year', 'CNIC', 'WhatsApp', 'Method', 'Status', 'Screenshot', 'ID Card', 'Action'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#3a6a3a', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #d4e8cc', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f0f7eb' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '500', whiteSpace: 'nowrap' }}>{p.full_name}</td>
                        <td style={{ padding: '12px 16px', color: '#6b8c6b' }}>{p.email}</td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{p.institution}</td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{p.year_of_study}</td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{p.cnic || '—'}</td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{p.whatsapp || '—'}</td>
                        <td style={{ padding: '12px 16px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{p.payment_method || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>{statusBadge(p.payment_status)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          {p.payment_screenshot_url
                            ? <a href={p.payment_screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#0d5e2e', fontSize: '12px', fontWeight: '500' }}>View →</a>
                            : <span style={{ color: '#ccc' }}>—</span>}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {p.id_card_url
                            ? <a href={p.id_card_url} target="_blank" rel="noreferrer" style={{ color: '#0d5e2e', fontSize: '12px', fontWeight: '500' }}>View →</a>
                            : <span style={{ color: '#ccc' }}>—</span>}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {p.payment_status === 'pending_verification' && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => verifyPayment(p.id)} disabled={actionLoading === p.id}
                                style={{ background: '#0d5e2e', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', opacity: actionLoading === p.id ? 0.6 : 1 }}>
                                {actionLoading === p.id ? 'Verifying...' : 'Verify ✓'}
                              </button>
                              <button onClick={() => rejectPayment(p.id)} disabled={actionLoading === p.id + '-reject'}
                                style={{ background: '#fdecea', color: '#a02020', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                                Reject ✗
                              </button>
                            </div>
                          )}
                          {p.payment_status === 'verified' && <span style={{ color: '#9ab89a', fontSize: '12px' }}>Done</span>}
                          {p.payment_status === 'unpaid' && <span style={{ color: '#ccc', fontSize: '12px' }}>Awaiting</span>}
                        </td>
                      </tr>
                    ))}
                    {profiles.length === 0 && (
                      <tr><td colSpan={11} style={{ padding: '2rem', textAlign: 'center', color: '#6b8c6b' }}>No registrations yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="admin-cards-wrap">
                {profiles.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#6b8c6b', padding: '2rem' }}>No registrations yet</p>
                )}
                {profiles.map(p => (
                  <div key={p.id} style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '12px', padding: '1.25rem', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '15px', color: '#1a2e1a' }}>{p.full_name}</p>
                        <p style={{ fontSize: '12px', color: '#6b8c6b', marginTop: '2px' }}>{p.email}</p>
                      </div>
                      {statusBadge(p.payment_status)}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#6b8c6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Institution</p>
                        <p style={{ fontSize: '13px', color: '#1a2e1a', marginTop: '2px' }}>{p.institution}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#6b8c6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Year</p>
                        <p style={{ fontSize: '13px', color: '#1a2e1a', marginTop: '2px' }}>{p.year_of_study}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#6b8c6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CNIC</p>
                        <p style={{ fontSize: '13px', color: '#1a2e1a', marginTop: '2px' }}>{p.cnic || '—'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#6b8c6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>WhatsApp</p>
                        <p style={{ fontSize: '13px', color: '#1a2e1a', marginTop: '2px' }}>{p.whatsapp || '—'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#6b8c6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Method</p>
                        <p style={{ fontSize: '13px', color: '#1a2e1a', marginTop: '2px', textTransform: 'capitalize' }}>{p.payment_method || '—'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#6b8c6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Screenshot</p>
                        {p.payment_screenshot_url
                          ? <a href={p.payment_screenshot_url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#0d5e2e', fontWeight: '500' }}>View →</a>
                          : <p style={{ fontSize: '13px', color: '#ccc' }}>—</p>}
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#6b8c6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID Card</p>
                        {p.id_card_url
                          ? <a href={p.id_card_url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#0d5e2e', fontWeight: '500' }}>View →</a>
                          : <p style={{ fontSize: '13px', color: '#ccc' }}>—</p>}
                      </div>
                    </div>
                    {p.payment_status === 'pending_verification' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => verifyPayment(p.id)} disabled={actionLoading === p.id}
                          style={{ flex: 1, background: '#0d5e2e', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', opacity: actionLoading === p.id ? 0.6 : 1 }}>
                          {actionLoading === p.id ? 'Verifying...' : 'Verify ✓'}
                        </button>
                        <button onClick={() => rejectPayment(p.id)} disabled={actionLoading === p.id + '-reject'}
                          style={{ flex: 1, background: '#fdecea', color: '#a02020', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                          Reject ✗
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'abstracts' && (
            <>
              <div className="admin-table-wrap" style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f0f7eb' }}>
                      {['Student', 'Institution', 'File', 'Submitted', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#3a6a3a', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #d4e8cc' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {abstracts.map(a => (
                      <tr key={a.id} style={{ borderBottom: '1px solid #f0f7eb' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '500' }}>{a.profiles?.full_name}</td>
                        <td style={{ padding: '12px 16px', color: '#6b8c6b' }}>{a.profiles?.institution}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <a href={a.file_url} target="_blank" rel="noreferrer" style={{ color: '#0d5e2e', fontSize: '12px', fontWeight: '500' }}>{a.file_name} →</a>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#6b8c6b' }}>{new Date(a.submitted_at).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px' }}>{statusBadge(a.status)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {a.status !== 'approved' && (
                              <button onClick={() => updateAbstractStatus(a.id, 'approved')} disabled={actionLoading === a.id}
                                style={{ background: '#e8f5e2', color: '#0d5e2e', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                                Approve
                              </button>
                            )}
                            {a.status !== 'rejected' && (
                              <button onClick={() => updateAbstractStatus(a.id, 'rejected')} disabled={actionLoading === a.id}
                                style={{ background: '#fdecea', color: '#a02020', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {abstracts.length === 0 && (
                      <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6b8c6b' }}>No abstracts submitted yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="admin-cards-wrap">
                {abstracts.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#6b8c6b', padding: '2rem' }}>No abstracts submitted yet</p>
                )}
                {abstracts.map(a => (
                  <div key={a.id} style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '12px', padding: '1.25rem', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '15px', color: '#1a2e1a' }}>{a.profiles?.full_name}</p>
                        <p style={{ fontSize: '12px', color: '#6b8c6b', marginTop: '2px' }}>{a.profiles?.institution}</p>
                      </div>
                      {statusBadge(a.status)}
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '11px', color: '#6b8c6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Abstract</p>
                      <a href={a.file_url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#0d5e2e', fontWeight: '500' }}>{a.file_name} →</a>
                      <p style={{ fontSize: '12px', color: '#6b8c6b', marginTop: '4px' }}>Submitted {new Date(a.submitted_at).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {a.status !== 'approved' && (
                        <button onClick={() => updateAbstractStatus(a.id, 'approved')} disabled={actionLoading === a.id}
                          style={{ flex: 1, background: '#e8f5e2', color: '#0d5e2e', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                          Approve ✓
                        </button>
                      )}
                      {a.status !== 'rejected' && (
                        <button onClick={() => updateAbstractStatus(a.id, 'rejected')} disabled={actionLoading === a.id}
                          style={{ flex: 1, background: '#fdecea', color: '#a02020', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                          Reject ✗
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}