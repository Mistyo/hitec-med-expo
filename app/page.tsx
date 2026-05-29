'use client'

import Link from 'next/link'
import { useTheme } from './context/theme'

export default function HomePage() {
  const { dark, toggleTheme } = useTheme()

  const t = {
    bg: dark ? '#0a1a0e' : '#f8faf6',
    card: dark ? '#0f2d14' : '#fff',
    cardBorder: dark ? '#1a4a20' : '#d4e8cc',
    text: dark ? '#e8f5e2' : '#1a2e1a',
    muted: dark ? '#6b9a6b' : '#6b8c6b',
    strip: dark ? '#0a1a0e' : '#fff',
    stripBorder: dark ? '#1a4a20' : '#e0edd8',
    sectionBg: dark ? '#0d2214' : '#fff',
  }

  return (
    <div style={{ minHeight: '100vh', background: t.bg, fontFamily: 'DM Sans, sans-serif', transition: 'background 0.3s' }}>

      <style>{`
        @media (max-width: 600px) {
          .nav-logo-text { display: none !important; }
          .nav-theme-label { display: none !important; }
          
          nav img {
            height: 55px !important;
            width: 55px !important;
          }
          
          .hero-section { 
            padding: 3.5rem 1.25rem 3.5rem !important; 
            text-align: right !important; 
            background-color: #061409 !important; 
            background-repeat: no-repeat !important; 
            background-position: -280px center !important; /* Shifted much further left */
            background-size: cover !important; 
            display: flex !important;
            justify-content: flex-end !important;
          }
          
          .hero-inner { 
            text-align: right !important; 
            margin-left: auto !important; 
            margin-right: 0 !important;
            max-width: 75% !important; 
          }
          
          .hero-inner h1 { font-size: 1.85rem !important; }
          .hero-inner p { font-size: 13px !important; }
          
          .hero-btns { 
            justify-content: flex-end !important; 
            flex-direction: column !important;
            align-items: flex-end !important;
            gap: 10px !important;
          }
          .hero-btns a { 
            width: 100% !important;
            max-width: 220px !important;
            padding: 11px 20px !important; 
            font-size: 13px !important; 
            text-align: center !important;
          }
          
          .info-strip { grid-template-columns: 1fr 1fr !important; }
          .info-strip-item { border-right: none !important; border-bottom: 1px solid ${t.stripBorder}; }
          .section-pad { padding: 2.5rem 1.25rem !important; }
          .cards-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .cta-section { padding: 3rem 1.25rem !important; }
          .cta-section h2 { font-size: 1.5rem !important; }
        }
        @media (max-width: 380px) {
          .cards-grid { grid-template-columns: 1fr !important; }
          .hero-inner h1 { font-size: 1.6rem !important; }
          .hero-inner { max-width: 80% !important; }
          .hero-section { background-position: -280px center !important; } /* Shifted even further for tiny screens */
        }
      `}</style>

      {/* NAV */}
      <nav style={{ background: '#0d5e2e', padding: '0 1rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <img
            src="hitec_logo1.PNG"
            alt="HITEC"
            style={{
              height: '125px',
              width: '125px',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              flexShrink: 0,
            }}
          />
          <span className="nav-logo-text" style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '600', whiteSpace: 'nowrap' }}>
            HITEC Med Expo 2026
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={toggleTheme}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {dark ? '☀️' : '🌙'} <span className="nav-theme-label">{dark ? 'Light' : 'Dark'}</span>
          </button>
          <Link href="/login" style={{ padding: '7px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', border: '1.5px solid rgba(255,255,255,0.5)', color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Sign In
          </Link>
          <Link href="/signup" style={{ padding: '7px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', background: '#fff', color: '#0d5e2e', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Register
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div
        className="hero-section"
        style={{
          backgroundImage: 'url(/background12.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          padding: '6rem 2rem 5rem',
          textAlign: 'right',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            pointerEvents: 'none',
          }}
        />
        <div className="hero-inner" style={{ maxWidth: '620px', marginLeft: 'auto', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '12px', fontWeight: '500', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.95)', textShadow: '0 0 4px #a8e6be, 0 0 8px #a8e6be, 0 0 2px #a8e6be', marginBottom: '1rem' }}>
            HITEC Institute of Medical Sciences · Taxila
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700', lineHeight: '1.15', marginBottom: '1rem' }}>
            HITEC Med Expo <span style={{ color: '#a8e6be' }}>2026</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.95)', textShadow: '0 0 4px #a8e6be, 0 0 8px #a8e6be, 0 0 2px #a8e6be', lineHeight: '1.7', marginBottom: '2rem' }}>
            Pakistan's premier student medical research exposition. Submit your abstract, present your findings, and shape the future of medicine.
          </p>
          <div className="hero-btns" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ background: '#fff', color: '#0d5e2e', padding: '13px 32px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
              Submit Your Abstract
            </Link>
            <Link href="/login" style={{ background: 'transparent', color: '#fff', padding: '13px 32px', borderRadius: '8px', fontWeight: '500', fontSize: '14px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)' }}>
              Already Registered?
            </Link>
          </div>
        </div>
      </div>

      {/* INFO STRIP */}
      <div className="info-strip" style={{ background: t.strip, borderBottom: `1px solid ${t.stripBorder}`, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', transition: 'background 0.3s' }}>
        {[
          { label: 'Date', value: 'July 2026' },
          { label: 'Venue', value: 'HITEC IMS, Taxila' },
          { label: 'Submission Deadline', value: 'June 15, 2026' },
          { label: 'Registration Fee', value: 'PKR 1,500' },
        ].map(item => (
          <div className="info-strip-item" key={item.label} style={{ padding: '1.25rem 1rem', textAlign: 'center', borderRight: `1px solid ${t.stripBorder}` }}>
            <p style={{ fontSize: '11px', color: t.muted, fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>{item.label}</p>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#0d5e2e', marginTop: '3px' }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <div className="section-pad" style={{ padding: '4rem 2rem', maxWidth: '860px', margin: '0 auto', transition: 'all 0.3s' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '600', color: '#0d5e2e', marginBottom: '0.5rem' }}>About the Expo</p>
        <p style={{ fontSize: '11px', color: t.muted, fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>HITEC Medical Research Exposition 2026</p>
        <p style={{ fontSize: '15px', color: t.text, lineHeight: '1.8', marginBottom: '1rem' }}>
          The HITEC Med Expo is an annual platform dedicated to showcasing groundbreaking research by medical and dental students across Pakistan. The event brings together future healthcare leaders to present, discuss, and celebrate scientific discovery.
        </p>
        <p style={{ fontSize: '15px', color: t.text, lineHeight: '1.8' }}>
          Open to MBBS, BDS, and postgraduate students from all recognized medical institutions in Pakistan. Abstracts are reviewed by a panel of faculty and senior clinicians.
        </p>
      </div>

      {/* WHY PARTICIPATE */}
      <div style={{ background: t.sectionBg, padding: '4rem 2rem', transition: 'background 0.3s' }}>
        <div className="section-pad" style={{ maxWidth: '860px', margin: '0 auto', padding: '0' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '600', color: '#0d5e2e', marginBottom: '0.5rem' }}>Why Participate?</p>
          <p style={{ fontSize: '11px', color: t.muted, fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2rem' }}>Open to all medical and dental students across Pakistan</p>
          <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🔬', title: 'Present Research', desc: 'Oral and poster presentation categories across all specialties' },
              { icon: '🏆', title: 'Win Awards', desc: 'Cash prizes and certificates for top abstracts in each category' },
              { icon: '🤝', title: 'Network', desc: 'Connect with faculty, researchers, and students nationwide' },
              { icon: '📄', title: 'Get Published', desc: 'Selected abstracts featured in the official expo proceedings' },
            ].map(card => (
              <div key={card.title} style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '12px', padding: '1.25rem', transition: 'all 0.3s' }}>
                <div style={{ fontSize: '28px', marginBottom: '0.75rem' }}>{card.icon}</div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '6px' }}>{card.title}</h4>
                <p style={{ fontSize: '13px', color: t.muted, lineHeight: '1.6' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="section-pad" style={{ padding: '4rem 2rem', maxWidth: '860px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '600', color: '#0d5e2e', marginBottom: '0.5rem' }}>How It Works</p>
        <p style={{ fontSize: '11px', color: t.muted, fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2rem' }}>Four simple steps</p>
        <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { step: '01', title: 'Register', desc: 'Create your account with your institutional details' },
            { step: '02', title: 'Pay Fee', desc: 'Complete registration fee via JazzCash, Easypaisa, or card' },
            { step: '03', title: 'Submit Abstract', desc: 'Upload your research abstract in PDF or Word format' },
            { step: '04', title: 'Get Results', desc: 'Receive approval and present at the expo in July' },
          ].map(item => (
            <div key={item.step} style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '12px', padding: '1.25rem', transition: 'all 0.3s' }}>
              <p style={{ fontSize: '24px', fontWeight: '700', color: dark ? '#2a6a3a' : '#c8e8b8', fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>{item.step}</p>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '6px' }}>{item.title}</h4>
              <p style={{ fontSize: '13px', color: t.muted, lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA BANNER */}
      <div className="cta-section" style={{ background: '#0d5e2e', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>Ready to Submit?</h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
          Registration closes June 15, 2026. Secure your spot today.
        </p>
        <Link href="/signup" style={{ background: '#fff', color: '#0d5e2e', padding: '13px 36px', borderRadius: '8px', fontWeight: '600', fontSize: '15px', textDecoration: 'none' }}>
          Register Now →
        </Link>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#0a4a24', padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>© 2026 HITEC Institute of Medical Sciences, HITEC Research Society · All rights reserved</p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Built by @Faateh_Aurangzeb</p>
      </div>

    </div>
  )
}