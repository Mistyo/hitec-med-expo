'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BackButton from '@/components/BackButton'


export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, payment_status')
      .eq('id', data.user.id)
      .single()


    if (profile?.role === 'admin') {
      router.push('/admin')
    } else if (profile?.payment_status !== 'verified') {
      router.push('/payment')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7eb', padding: '2rem', position: 'relative' }}>
      <BackButton href="/" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 4rem)' }}>
        <div style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#0d5e2e', fontWeight: '600' }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: '13px', color: '#6b8c6b', marginTop: '4px' }}>
              HITEC Med Expo 2026 · Abstract Submission Portal
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'your@email.com' },
              { label: 'Password', name: 'password', type: 'password', placeholder: 'Your password' },
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

            {error && (
              <p style={{ color: '#a02020', fontSize: '13px', marginBottom: '1rem', background: '#fdecea', padding: '10px', borderRadius: '8px' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: '#0d5e2e', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '0.5rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b8c6b', marginTop: '1rem' }}>
            <Link href="/forgot-password" style={{ color: '#0d5e2e' }}>Forgot password?</Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b8c6b', marginTop: '0.5rem' }}>
            No account yet?{' '}
            <Link href="/signup" style={{ color: '#0d5e2e', fontWeight: '500' }}>Register here</Link>
          </p>

          <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0edd8' }}>
            <Link href="/admin" style={{ fontSize: '12px', color: '#9ab89a', textDecoration: 'none' }}>
              Admin access →
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}