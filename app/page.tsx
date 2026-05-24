import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8faf6', fontFamily: 'DM Sans, sans-serif' }}>
      
      {/* NAV */}
      <nav style={{ background: '#0d5e2e', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '600' }}>
            HITEC Med Expo 2026
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/login" style={{ padding: '7px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', border: '1.5px solid rgba(255,255,255,0.5)', color: '#fff', textDecoration: 'none' }}>
            Sign In
          </Link>
          <Link href="/signup" style={{ padding: '7px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', background: '#fff', color: '#0d5e2e', textDecoration: 'none' }}>
            Register
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(160deg, #0a4a24 0%, #0d5e2e 50%, #1a7a3e 100%)', padding: '5rem 2rem 4rem', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <p style={{ fontSize: '12px', fontWeight: '500', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
          HITEC Institute of Medical Sciences · Taxila
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: '700', lineHeight: '1.15', marginBottom: '1rem' }}>
          HITEC Med Expo <span style={{ color: '#a8e6be' }}>2026</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: '1.7' }}>
          Pakistan's premier student medical research exposition. Submit your abstract, present your findings, and shape the future of medicine.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" style={{ background: '#fff', color: '#0d5e2e', padding: '13px 32px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
            Submit Your Abstract
          </Link>
          <Link href="/login" style={{ background: 'transparent', color: '#fff', padding: '13px 32px', borderRadius: '8px', fontWeight: '500', fontSize: '14px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)' }}>
            Already Registered?
          </Link>
        </div>
      </div>

      {/* INFO STRIP */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0edd8', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Date', value: 'July 2026' },
          { label: 'Venue', value: 'HITEC IMS, Taxila' },
          { label: 'Submission Deadline', value: 'June 15, 2026' },
          { label: 'Registration Fee', value: 'PKR 1,500' },
        ].map(item => (
          <div key={item.label} style={{ padding: '1.25rem 2rem', textAlign: 'center', borderRight: '1px solid #e0edd8' }}>
            <p style={{ fontSize: '11px', color: '#6b8c6b', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>{item.label}</p>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#0d5e2e', marginTop: '3px' }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <div style={{ padding: '4rem 2rem', maxWidth: '860px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '600', color: '#0d5e2e', marginBottom: '0.5rem' }}>
          About the Expo
        </p>
        <p style={{ fontSize: '11px', color: '#6b8c6b', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          HITEC Medical Research Exposition 2026
        </p>
        <p style={{ fontSize: '15px', color: '#3a4a3a', lineHeight: '1.8', marginBottom: '1rem' }}>
          The HITEC Med Expo is an annual platform dedicated to showcasing groundbreaking research by medical and dental students across Pakistan. The event brings together future healthcare leaders to present, discuss, and celebrate scientific discovery.
        </p>
        <p style={{ fontSize: '15px', color: '#3a4a3a', lineHeight: '1.8' }}>
          Open to MBBS, BDS, and postgraduate students from all recognized medical institutions in Pakistan. Abstracts are reviewed by a panel of faculty and senior clinicians.
        </p>
      </div>

      {/* WHY PARTICIPATE */}
      <div style={{ background: '#fff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '600', color: '#0d5e2e', marginBottom: '0.5rem' }}>
            Why Participate?
          </p>
          <p style={{ fontSize: '11px', color: '#6b8c6b', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2rem' }}>
            Open to all medical and dental students across Pakistan
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🔬', title: 'Present Research', desc: 'Oral and poster presentation categories across all specialties' },
              { icon: '🏆', title: 'Win Awards', desc: 'Cash prizes and certificates for top abstracts in each category' },
              { icon: '🤝', title: 'Network', desc: 'Connect with faculty, researchers, and students nationwide' },
              { icon: '📄', title: 'Get Published', desc: 'Selected abstracts featured in the official expo proceedings' },
            ].map(card => (
              <div key={card.title} style={{ background: '#f8faf6', border: '1px solid #d4e8cc', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '28px', marginBottom: '0.75rem' }}>{card.icon}</div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1a2e1a', marginBottom: '6px' }}>{card.title}</h4>
                <p style={{ fontSize: '13px', color: '#6b8c6b', lineHeight: '1.6' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: '4rem 2rem', maxWidth: '860px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '600', color: '#0d5e2e', marginBottom: '0.5rem' }}>
          How It Works
        </p>
        <p style={{ fontSize: '11px', color: '#6b8c6b', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2rem' }}>
          Four simple steps
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { step: '01', title: 'Register', desc: 'Create your account with your institutional details' },
            { step: '02', title: 'Pay Fee', desc: 'Complete registration fee via JazzCash, Easypaisa, or card' },
            { step: '03', title: 'Submit Abstract', desc: 'Upload your research abstract in PDF or Word format' },
            { step: '04', title: 'Get Results', desc: 'Receive approval and present at the expo in July' },
          ].map(item => (
            <div key={item.step} style={{ background: '#fff', border: '1px solid #d4e8cc', borderRadius: '12px', padding: '1.25rem' }}>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#c8e8b8', fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>{item.step}</p>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1a2e1a', marginBottom: '6px' }}>{item.title}</h4>
              <p style={{ fontSize: '13px', color: '#6b8c6b', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA BANNER */}
      <div style={{ background: '#0d5e2e', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>
          Ready to Submit?
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
          Registration closes June 15, 2026. Secure your spot today.
        </p>
        <Link href="/signup" style={{ background: '#fff', color: '#0d5e2e', padding: '13px 36px', borderRadius: '8px', fontWeight: '600', fontSize: '15px', textDecoration: 'none' }}>
          Register Now →
        </Link>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#0a4a24', padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
          © 2026 HITEC Research Society, HITEC-IMS · All rights reserved
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
          Built by @FaatehAurangzaib
        </p>
      </div>

    </div>
  )
}