'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/BackButton'
import { useState, useEffect } from 'react'

export default function PaymentPage() {
  const router = useRouter()
  const supabase = createClient()

  const [method, setMethod] = useState<'online' | 'manual' | null>(null)
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('payment_status')
        .eq('id', user.id)
        .single()

      if (profile?.payment_status === 'verified') {
        router.push('/dashboard')
      }
    }

    checkPaymentStatus()
  }, [])

  const handleScreenshotUpload = async () => {
    if (!screenshot) return
    setUploading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const fileExt = screenshot.name.split('.').pop()
    const filePath = `payment-screenshots/${user.id}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('Abstracts')
      .upload(filePath, screenshot, { upsert: true })

    if (uploadError) {
      console.log('Upload error:', uploadError)
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data: signedUrlData } = await supabase.storage
      .from('Abstracts')
      .createSignedUrl(filePath, 60 * 60 * 24 * 5) // 5 days

    await supabase
      .from('profiles')
      .update({
        payment_method: 'manual',
        payment_status: 'pending_verification',
        payment_screenshot_url: signedUrlData?.signedUrl || '',
      })
      .eq('id', user.id)
 

    setSuccess(true)
    setUploading(false)
  }

  if (success) {

    return (

      <div style={{ minHeight: '100vh', background: '#f0f7eb', padding: '2rem', position: 'relative' }}>

        <BackButton href="/signup" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 4rem)' }}>

          <div style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px', textAlign: 'center' }}>

            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>✅</div>

            <h2 style={{ fontFamily: 'Georgia, serif', color: '#0d5e2e', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Payment Screenshot Submitted</h2>

            <p style={{ fontSize: '14px', color: '#6b8c6b', lineHeight: '1.6' }}>

              Your payment is being verified by our team. You'll receive a confirmation email once approved — usually within 24 hours.

            </p>

          </div>

        </div>

      </div>

    )

  }



  return (

    <div style={{ minHeight: '100vh', background: '#f0f7eb', padding: '2rem', position: 'relative' }}>

      <BackButton href="/signup" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 4rem)' }}>

        <div style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '480px' }}>



          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>

            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#0d5e2e', fontWeight: '600' }}>

              Complete Payment

            </h1>

            <p style={{ fontSize: '13px', color: '#6b8c6b', marginTop: '4px' }}>

              HITEC Med Expo 2026 · Registration Fee

            </p>

            <div style={{ background: '#f0f7eb', borderRadius: '10px', padding: '1rem', margin: '1rem 0' }}>

              <p style={{ fontSize: '13px', color: '#3a6a3a' }}>Amount due</p>

              <strong style={{ fontSize: '24px', color: '#0d5e2e', display: 'block' }}>PKR 1,500</strong>

            </div>

          </div>



          {!method && (

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

              <button

                onClick={() => setMethod('online')}

                style={{ padding: '1.5rem 1rem', border: '2px solid #d4e8cc', borderRadius: '12px', background: '#fff', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}

                onMouseOver={e => (e.currentTarget.style.borderColor = '#0d5e2e')}

                onMouseOut={e => (e.currentTarget.style.borderColor = '#d4e8cc')}

              >

                <div style={{ fontSize: '28px', marginBottom: '8px' }}>💳</div>

                <p style={{ fontWeight: '600', fontSize: '14px', color: '#1a2e1a' }}>Pay Online</p>

                <p style={{ fontSize: '12px', color: '#6b8c6b', marginTop: '4px' }}>Card · JazzCash · Easypaisa via Safepay</p>

              </button>



              <button

                onClick={() => setMethod('manual')}

                style={{ padding: '1.5rem 1rem', border: '2px solid #d4e8cc', borderRadius: '12px', background: '#fff', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}

                onMouseOver={e => (e.currentTarget.style.borderColor = '#0d5e2e')}

                onMouseOut={e => (e.currentTarget.style.borderColor = '#d4e8cc')}

              >

                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📱</div>

                <p style={{ fontWeight: '600', fontSize: '14px', color: '#1a2e1a' }}>Pay Manually</p>

                <p style={{ fontSize: '12px', color: '#6b8c6b', marginTop: '4px' }}>JazzCash · Easypaisa · Bank Transfer</p>

              </button>

            </div>

          )}



          {method === 'online' && (

            <div style={{ textAlign: 'center' }}>

              <div style={{ background: '#f0f7eb', borderRadius: '10px', padding: '1.5rem', marginBottom: '1rem' }}>

                <p style={{ fontSize: '14px', color: '#3a6a3a' }}>You'll be redirected to Safepay's secure checkout</p>

              </div>

              <button

                style={{ width: '100%', background: '#0d5e2e', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '1rem' }}

                onClick={() => alert('Safepay integration coming soon — use manual payment for now')}

              >

                Continue to Safepay →

              </button>

              <button onClick={() => setMethod(null)} style={{ background: 'none', border: 'none', color: '#6b8c6b', fontSize: '13px', cursor: 'pointer' }}>

                ← Back

              </button>

            </div>

          )}



          {method === 'manual' && (

            <div>

              <div style={{ background: '#f0f7eb', border: '1px solid #d4e8cc', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>

                <p style={{ fontSize: '13px', fontWeight: '600', color: '#0d5e2e', marginBottom: '8px' }}>Send PKR 1,500 to:</p>

                <p style={{ fontSize: '14px', color: '#1a2e1a' }}>📱 JazzCash / Easypaisa: <strong>0300-5258949</strong></p>

                <p style={{ fontSize: '14px', color: '#1a2e1a', marginTop: '4px' }}>🏦 Bank: <strong>Account details here</strong></p>

                <p style={{ fontSize: '12px', color: '#6b8c6b', marginTop: '8px' }}>Use your full name as the reference</p>

              </div>



              <div

                style={{ border: '2px dashed #9acc88', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: '#fafefa', marginBottom: '1rem', cursor: 'pointer' }}

                onClick={() => document.getElementById('screenshot-input')?.click()}

              >

                {screenshot ? (

                  <p style={{ fontSize: '14px', color: '#0d5e2e', fontWeight: '500' }}>✓ {screenshot.name}</p>

                ) : (

                  <>

                    <p style={{ fontSize: '24px', marginBottom: '8px' }}>📸</p>

                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a2e1a' }}>Upload Payment Screenshot</p>

                    <p style={{ fontSize: '12px', color: '#6b8c6b', marginTop: '4px' }}>JPG, PNG or PDF · Max 5MB</p>

                  </>

                )}

              </div>



              <input

                id="screenshot-input"

                type="file"

                accept="image/*,.pdf"

                style={{ display: 'none' }}

                onChange={e => setScreenshot(e.target.files?.[0] || null)}

              />



              {error && (

                <p style={{ color: '#a02020', fontSize: '13px', marginBottom: '1rem', background: '#fdecea', padding: '10px', borderRadius: '8px' }}>

                  {error}

                </p>

              )}



              <button

                onClick={handleScreenshotUpload}

                disabled={!screenshot || uploading}

                style={{ width: '100%', background: '#0d5e2e', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: (!screenshot || uploading) ? 'not-allowed' : 'pointer', opacity: (!screenshot || uploading) ? 0.6 : 1, marginBottom: '1rem' }}

              >

                {uploading ? 'Submitting...' : 'Submit Payment Screenshot →'}

              </button>



              <button onClick={() => setMethod(null)} style={{ background: 'none', border: 'none', color: '#6b8c6b', fontSize: '13px', cursor: 'pointer', display: 'block', margin: '0 auto' }}>

                ← Back

              </button>

            </div>

          )}



        </div>

      </div>

    </div>

  )
}