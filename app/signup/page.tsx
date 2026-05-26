'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

const groups = [
  { label: 'BDS', options: ['BDS 1st Year', 'BDS 2nd Year', 'BDS 3rd Year', 'BDS 4th Year'] },
  { label: 'MBBS', options: ['MBBS 1st Year', 'MBBS 2nd Year', 'MBBS 3rd Year', 'MBBS 4th Year', 'MBBS 5th Year'] },
  { label: 'Postgraduate', options: ['House Officer', 'FCPS Part 1', 'FCPS Part 2', 'MS/MD', 'MPhil', 'PhD'] },
  { label: 'Nursing & Allied', options: ['BSN 1st Year', 'BSN 2nd Year', 'BSN 3rd Year', 'BSN 4th Year', 'Allied Health Sciences'] },
]

function CustomSelect({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: `1.5px solid ${open ? '#0d5e2e' : '#cce0c0'}`,
          borderRadius: open ? '8px 8px 0 0' : '8px',
          fontSize: '14px',
          background: '#fafefa',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: value ? '#1a2e1a' : '#9ab89a',
          userSelect: 'none',
        }}
      >
        <span>{value || 'Select year...'}</span>
        <span style={{
          fontSize: '10px',
          color: '#6b8c6b',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          display: 'inline-block'
        }}>▼</span>
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1.5px solid #0d5e2e',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          zIndex: 100,
          maxHeight: '260px',
          overflowY: 'auto',
          boxShadow: '0 8px 24px rgba(13,94,46,0.12)',
        }}>
          {groups.map(group => (
            <div key={group.label}>
              <div style={{
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#0d5e2e',
                background: '#f0f7eb',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}>
                {group.label}
              </div>
              {group.options.map(opt => (
                <div
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false) }}
                  style={{
                    padding: '9px 14px 9px 20px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    color: value === opt ? '#0d5e2e' : '#1a2e1a',
                    background: value === opt ? '#e8f5e2' : '#fff',
                    fontWeight: value === opt ? '500' : '400',
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = '#f0f7eb')}
                  onMouseOut={e => (e.currentTarget.style.background = value === opt ? '#e8f5e2' : '#fff')}
                >
                  {value === opt ? '✓ ' : ''}{opt}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    institution: '',
    year_of_study: '',
    cnic: '',
    whatsapp: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!form.year_of_study) {
      setError('Please select your year of study.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          institution: form.institution,
          year_of_study: form.year_of_study,
          cnic: form.cnic,
          whatsapp: form.whatsapp,
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/payment')
  }

  return (

    <div style={{ minHeight: '100vh', background: '#f0f7eb', padding: '2rem', position: 'relative' }}>

      <BackButton href="/" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 4rem)' }}>

        <div style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#0d5e2e', fontWeight: '600' }}>
              Create Account
            </h1>
            <p style={{ fontSize: '13px', color: '#6b8c6b', marginTop: '4px' }}>
              HITEC Med Expo 2026 · Abstract Submission Portal
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'your@email.com' },
              { label: 'Institution', name: 'institution', type: 'text', placeholder: 'e.g. HITEC IMS, AKU...' },
              { label: 'CNIC Number', name: 'cnic', type: 'text', placeholder: '12345-1234567-1' },
              { label: 'WhatsApp Number', name: 'whatsapp', type: 'text', placeholder: '03XX-XXXXXXX' },
              { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 8 characters' },
            ].map(field => (
       
              <div key={field.name} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#2a4a2a', marginBottom: '5px' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cce0c0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#2a4a2a', marginBottom: '5px' }}>
                Year of Study
              </label>
              <CustomSelect
                value={form.year_of_study}
                onChange={(val) => setForm({ ...form, year_of_study: val })}
              />
            </div>

            <div style={{ background: '#f0f7eb', border: '1.5px dashed #7abf7a', borderRadius: '10px', padding: '1rem', textAlign: 'center', margin: '1rem 0' }}>
              <p style={{ fontSize: '13px', color: '#3a6a3a' }}>Registration fee</p>
              <strong style={{ fontSize: '20px', color: '#0d5e2e', display: 'block', margin: '4px 0' }}>PKR 1,500</strong>
              <p style={{ fontSize: '12px', color: '#6b8c6b' }}>Payment on next step</p>
            </div>

            {error && (
              <p style={{ color: '#a02020', fontSize: '13px', marginBottom: '1rem', background: '#fdecea', padding: '10px', borderRadius: '8px' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: '#0d5e2e', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b8c6b', marginTop: '1.25rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#0d5e2e', fontWeight: '500' }}>Sign in</Link>
          </p>

        </div>

      </div>

    </div>

  )
}