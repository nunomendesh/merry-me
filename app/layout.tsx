'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

const WA_LINK = 'https://wa.me/996502454647';
const INSTAGRAM = 'https://www.instagram.com/marryme_007_/';
const PHONE = '+996 502 454 647';

const SERVICE_PAGES = ['/proposal', '/mama', '/birthday'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isServicePage = SERVICE_PAGES.includes(pathname);
  const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/profile');

  return (
    <html lang="ru">
    <head>
      <title>marryme_007 — Организация праздников в Бишкеке</title>
      <meta name="description" content="marryme_007 — организуем предложение руки и сердца, сюрпризы для мамы и дни рождения под ключ. Декор, холодные фонтаны, живые цветы. Бишкек." />
    </head>
    <body style={{ margin: 0, background: '#0d0118', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAdminPage && (
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(13, 1, 24, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(214, 51, 132, 0.15)',
          padding: '0 24px',
          height: '56px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            {isServicePage ? (
              <Link href="/" style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                ← Назад
              </Link>
            ) : (
              <Link href="/" style={{ fontWeight: 700, fontSize: '16px', color: '#fff', letterSpacing: '0.3px' }}>
                marryme_007
              </Link>
            )}
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#1db954',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '24px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <span>📞</span> {PHONE}
          </a>
        </header>
      )}

      <main style={{ flex: 1 }}>{children}</main>

      {!isAdminPage && (
        <footer style={{
          background: 'rgba(13, 1, 24, 0.95)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '28px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>marryme_007</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '10px' }}>
            © 2025 marryme_007. Бишкек, Кыргызстан
          </div>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#d63384', fontSize: '13px', fontWeight: 600 }}
          >
            @marryme_007
          </a>
        </footer>
      )}
    </body>
    </html>
  );
}
