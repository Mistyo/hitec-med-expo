'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7eb', padding: '2rem', position: 'relative' }}>
      <BackButton href="/login" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 4rem)' }}>
        <div style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>

          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📧</div>
              <h2 style={{ fontFamily: 'Georgia, serif', color: '#0d5e2e', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Check Your Email</h2>
              <p style={{ fontSize: '14px', color: '#6b8c6b', lineHeight: '1.6' }}>
                We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the link.
              </p>
              <Link href="/login" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#0d5e2e', fontSize: '14px', fontWeight: '500' }}>
                Back to login →
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#0d5e2e', fontWeight: '600' }}>
                  Forgot Password?
                </h1>
                <p style={{ fontSize: '13px', color: '#6b8c6b', marginTop: '4px' }}>
                  Enter your email and we'll send a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#2a4a2a', marginBottom: '5px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cce0c0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
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
                  {loading ? 'Sending...' : 'Send Reset Link →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}