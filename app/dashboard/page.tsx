'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Profile = {
  full_name: string
  email: string
  institution: string
  year_of_study: string
  payment_status: string
}

type Abstract = {
  id: string
  file_name: string
  file_url: string
  status: string
  submitted_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [abstract, setAbstract] = useState<Abstract | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profileData) { router.push('/login'); return }
    if (profileData.role === 'admin') { router.push('/admin'); return }
    if (profileData.payment_status !== 'verified') { router.push('/payment'); return }

    setProfile(profileData)

    const { data: abstractData } = await supabase
      .from('abstracts')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (abstractData) setAbstract(abstractData)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const fileExt = file.name.split('.').pop()
    const filePath = `abstracts/${user.id}_${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('Abstracts')
      .upload(filePath, file)

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data: signedUrlData } = await supabase.storage
      .from('Abstracts')
      .createSignedUrl(filePath, 60 * 60 * 24 * 5)

    const { error: insertError } = await supabase
      .from('abstracts')
      .insert({
        user_id: user.id,
        file_url: signedUrlData?.signedUrl || '',
        file_name: file.name,
        file_size: file.size,
        status: 'pending'
      })

    if (insertError) {
      setError(insertError.message)
      setUploading(false)
      return
    }

    setSuccess(true)
    setUploading(false)
    await loadDashboard()
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string; icon: string }> = {
      pending:  { bg: '#fef9e7', color: '#a07000', label: 'Under Review', icon: '⏳' },
      approved: { bg: '#e8f5e2', color: '#0d5e2e', label: 'Approved', icon: '✅' },
      rejected: { bg: '#fdecea', color: '#a02020', label: 'Rejected', icon: '❌' },
    }
    const s = styles[status] || styles.pending
    return (
      <span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
        {s.icon} {s.label}
      </span>
    )
  }

  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f7eb' }}>
      <p style={{ color: '#0d5e2e', fontSize: '14px' }}>Loading...</p>
    </div>
  )

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .dash-submission { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .dash-submission-actions { width: 100%; display: flex; justify-content: space-between; align-items: center; }
          .dash-nav-brand { font-size: 14px !important; }
          .dash-wrap { padding: 1.25rem !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f8faf6' }}>
        <nav style={{ background: '#0d5e2e', padding: '0 1.25rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="dash-nav-brand" style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '600' }}>
            HITEC Med Expo 2026
          </span>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
            style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.5)', color: '#fff', padding: '7px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Sign Out
          </button>
        </nav>

        <div className="dash-wrap" style={{ padding: '2rem', maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', color: '#0d5e2e' }}>
              Welcome, {profile.full_name}
            </h1>
            <p style={{ fontSize: '14px', color: '#6b8c6b', marginTop: '4px' }}>
              {profile.institution} · {profile.year_of_study}
            </p>
            <span style={{ display: 'inline-block', background: '#e8f5e2', color: '#0d5e2e', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', marginTop: '8px', border: '1px solid #b8dca8' }}>
              ✓ Payment Verified — Account Active
            </span>
          </div>

          {!abstract ? (
            <div style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '16px', padding: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#0d5e2e', marginBottom: '0.5rem' }}>
                Submit Your Abstract
              </h2>
              <p style={{ fontSize: '13px', color: '#6b8c6b', marginBottom: '1.5rem' }}>
                PDF or Word (.docx) only · Max 10MB · One submission per registrant
              </p>

              <div
                style={{ border: '2px dashed #9acc88', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: '#fafefa', marginBottom: '1rem', cursor: 'pointer' }}
                onClick={() => document.getElementById('abstract-input')?.click()}
              >
                {file ? (
                  <p style={{ fontSize: '14px', color: '#0d5e2e', fontWeight: '500', wordBreak: 'break-all' }}>✓ {file.name}</p>
                ) : (
                  <>
                    <p style={{ fontSize: '32px', marginBottom: '8px' }}>📄</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a2e1a' }}>Tap to choose file</p>
                    <p style={{ fontSize: '12px', color: '#6b8c6b', marginTop: '4px' }}>PDF or DOCX · Max 10MB</p>
                  </>
                )}
              </div>

              <input
                id="abstract-input"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                style={{ display: 'none' }}
                onChange={e => setFile(e.target.files?.[0] || null)}
              />

              {error && (
                <p style={{ color: '#a02020', fontSize: '13px', marginBottom: '1rem', background: '#fdecea', padding: '10px', borderRadius: '8px' }}>
                  {error}
                </p>
              )}

              {success && (
                <p style={{ color: '#0d5e2e', fontSize: '13px', marginBottom: '1rem', background: '#e8f5e2', padding: '10px', borderRadius: '8px' }}>
                  ✅ Abstract submitted successfully!
                </p>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                style={{ width: '100%', background: '#0d5e2e', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: (!file || uploading) ? 'not-allowed' : 'pointer', opacity: (!file || uploading) ? 0.6 : 1 }}
              >
                {uploading ? 'Uploading...' : 'Submit Abstract →'}
              </button>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '16px', padding: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#0d5e2e', marginBottom: '1.5rem' }}>
                Your Submission
              </h2>
              <div className="dash-submission" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8faf6', borderRadius: '10px', border: '1px solid #e0edd8' }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '14px', color: '#1a2e1a', wordBreak: 'break-all' }}>{abstract.file_name}</p>
                  <p style={{ fontSize: '12px', color: '#6b8c6b', marginTop: '2px' }}>
                    Submitted {new Date(abstract.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="dash-submission-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  {statusBadge(abstract.status)}
                  <a href={abstract.file_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#0d5e2e', fontWeight: '500', whiteSpace: 'nowrap' }}>View →</a>
                </div>
              </div>

              {abstract.status === 'rejected' && (
                <div style={{ marginTop: '1rem', background: '#fdecea', borderRadius: '10px', padding: '1rem' }}>
                  <p style={{ fontSize: '13px', color: '#a02020' }}>
                    Your abstract was rejected. Please contact the organizing committee for more information.
                  </p>
                </div>
              )}

              {abstract.status === 'approved' && (
                <div style={{ marginTop: '1rem', background: '#e8f5e2', borderRadius: '10px', padding: '1rem' }}>
                  <p style={{ fontSize: '13px', color: '#0d5e2e' }}>
                    🎉 Congratulations! Your abstract has been approved. Further details will be sent to your email.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}