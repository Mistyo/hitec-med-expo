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
    const { data: { user } } = await supabase.auth.getUser()
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
      fetch('/api/admin/Abstracts').then(r => r.json()),
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
    if (res.ok) {
      await loadData()
    }
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
      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
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
    <div style={{ minHeight: '100vh', background: '#f8faf6' }}>
      <nav style={{ background: '#0d5e2e', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '600' }}>
          HITEC Med Expo 2026 · Admin
        </span>
        <button
          onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
          style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.5)', color: '#fff', padding: '7px 18px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
          {[
            { label: 'Total Registered', val: stats.total, color: '#0d5e2e' },
            { label: 'Payment Verified', val: stats.verified, color: '#0d5e2e' },
            { label: 'Pending Verification', val: stats.pending, color: '#a07000' },
            { label: 'Abstracts Submitted', val: stats.abstracts, color: '#0d5e2e' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '10px', padding: '1rem 1.25rem' }}>
              <p style={{ fontSize: '11px', color: '#6b8c6b', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</p>
              <p style={{ fontSize: '26px', fontWeight: '600', color: s.color, marginTop: '4px' }}>{s.val}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '1px solid #d4e8cc' }}>
          {(['payments', 'abstracts'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #0d5e2e' : '2px solid transparent', color: tab === t ? '#0d5e2e' : '#6b8c6b', fontWeight: tab === t ? '600' : '400', fontSize: '14px', cursor: 'pointer', textTransform: 'capitalize' }}
            >
              {t === 'payments' ? 'Payment Verifications' : 'Abstract Reviews'}
            </button>
          ))}
        </div>

        {tab === 'payments' && (
          <div style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f0f7eb' }}>
                  {['Name', 'Email', 'Institution', 'Year', 'Method', 'Status', 'Screenshot', 'Action'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#3a6a3a', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #d4e8cc' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{p.full_name}</td>
                    <td style={{ padding: '12px 16px', color: '#6b8c6b' }}>{p.email}</td>
                    <td style={{ padding: '12px 16px' }}>{p.institution}</td>
                    <td style={{ padding: '12px 16px' }}>{p.year_of_study}</td>
                    <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{p.payment_method || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>{statusBadge(p.payment_status)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.payment_screenshot_url
                        ? <a href={p.payment_screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#0d5e2e', fontSize: '12px', fontWeight: '500' }}>View →</a>
                        : <span style={{ color: '#ccc' }}>—</span>
                      }
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.payment_status === 'pending_verification' && (
                        <button
                          onClick={() => verifyPayment(p.id)}
                          disabled={actionLoading === p.id}
                          style={{ background: '#0d5e2e', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', opacity: actionLoading === p.id ? 0.6 : 1 }}
                        >
                          {actionLoading === p.id ? 'Verifying...' : 'Verify ✓'}
                        </button>
                      )}
                      {p.payment_status === 'verified' && (
                        <span style={{ color: '#9ab89a', fontSize: '12px' }}>Done</span>
                      )}
                      {p.payment_status === 'unpaid' && (
                        <span style={{ color: '#ccc', fontSize: '12px' }}>Awaiting payment</span>
                      )}
                    </td>
                  </tr>
                ))}
                {profiles.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#6b8c6b' }}>No registrations yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'abstracts' && (
          <div style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '12px', overflow: 'hidden' }}>
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
                    <td style={{ padding: '12px 16px', display: 'flex', gap: '6px' }}>
                      {a.status !== 'approved' && (
                        <button
                          onClick={() => updateAbstractStatus(a.id, 'approved')}
                          disabled={actionLoading === a.id}
                          style={{ background: '#e8f5e2', color: '#0d5e2e', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                        >
                          Approve
                        </button>
                      )}
                      {a.status !== 'rejected' && (
                        <button
                          onClick={() => updateAbstractStatus(a.id, 'rejected')}
                          disabled={actionLoading === a.id}
                          style={{ background: '#fdecea', color: '#a02020', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {abstracts.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6b8c6b' }}>No abstracts submitted yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}