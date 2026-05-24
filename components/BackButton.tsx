'use client'

import { useRouter } from 'next/navigation'

export default function BackButton({ href }: { href?: string }) {
  const router = useRouter()

  return (
    <button
      onClick={() => href ? router.push(href) : router.back()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        color: '#0d5e2e',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        padding: '8px 0',
        marginBottom: '1rem',
      }}
    >
      ← Back
    </button>
  )
}