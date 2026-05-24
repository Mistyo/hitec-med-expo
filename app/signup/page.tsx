'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          institution: form.institution,
          year_of_study: form.year_of_study,
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
    <div style={{ minHeight: '100vh', background: '#f0f7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
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
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cce0c0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
            </div>
          ))}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#2a4a2a', marginBottom: '5px' }}>
              Year of Study
            </label>
            <select
              name="year_of_study"
              value={form.year_of_study}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cce0c0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            >
              <option value="">Select year...</option>
              <option>1st Year MBBS/BDS</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
              <option>Final Year</option>
              <option>House Officer</option>
              <option>Postgraduate</option>
            </select>
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
  )
}