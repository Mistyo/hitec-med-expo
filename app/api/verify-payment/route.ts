import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  const { data: studentProfile, error: fetchError } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (fetchError || !studentProfile) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 })
  }

  const { error: updateError } = await adminSupabase
    .from('profiles')
    .update({ payment_status: 'verified' })
    .eq('id', userId)

  if (updateError) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  const { error: emailError } = await resend.emails.send({
    from: 'HITEC Med Expo 2026 <onboarding@resend.dev>',
    to: 'mistersyed6@gmail.com',
    subject: 'Payment Verified — HITEC Med Expo 2026',
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 2rem; color: #1a2e1a;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h1 style="color: #0d5e2e; font-size: 1.5rem;">HITEC Med Expo 2026</h1>
          <p style="color: #6b8c6b; font-size: 13px;">Abstract Submission Portal</p>
        </div>

        <div style="background: #f0f7eb; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
          <p style="font-size: 2rem; margin-bottom: 0.5rem;">✅</p>
          <h2 style="color: #0d5e2e; margin-bottom: 0.5rem;">Payment Verified!</h2>
          <p style="color: #3a6a3a; font-size: 14px;">Your registration is now confirmed.</p>
        </div>

        <p style="font-size: 15px; line-height: 1.7;">Dear <strong>${studentProfile.full_name}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.7; margin-top: 1rem;">
          Your payment of <strong>PKR 1,500</strong> has been verified by our team. 
          You can now log in to the portal and submit your abstract.
        </p>

        <div style="text-align: center; margin: 2rem 0;">
          <a 
            href="${process.env.NEXT_PUBLIC_SITE_URL}/login" 
            style="background: #0d5e2e; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;"
          >
            Login & Submit Abstract →
          </a>
        </div>

        <p style="font-size: 13px; color: #6b8c6b; margin-top: 2rem;">
          Registration details:<br/>
          Name: ${studentProfile.full_name}<br/>
          Institution: ${studentProfile.institution}<br/>
          Year: ${studentProfile.year_of_study}
        </p>

        <hr style="border: none; border-top: 1px solid #d4e8cc; margin: 1.5rem 0;">
        <p style="font-size: 12px; color: #9ab89a; text-align: center;">
          HITEC Institute of Medical Sciences, Taxila<br/>
          This is an automated email — please do not reply.
        </p>
      </div>
    `
  })

  if (emailError) {
    console.error('Email failed:', emailError)
    return NextResponse.json({ success: true, emailError: emailError.message })
  }

  console.log('Email sent successfully')

  return NextResponse.json({ success: true })
}