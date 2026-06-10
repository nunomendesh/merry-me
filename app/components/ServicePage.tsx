'use client';

import React from 'react';
import type { CSSProperties } from 'react';

const WA = '996502454647';
const IG = 'https://www.instagram.com/marryme_007_/';

export interface ServicePackage {
  tier: string;
  title: string;
  price: number;
  oldPrice: number;
  items: string[];
  popular?: boolean;
}

export interface WorkItem {
  gradient: string;
  emoji: string;
  title: string;
  desc: string;
}

export interface ExtraService {
  emoji: string;
  title: string;
  price: string;
}

export interface ServicePageProps {
  emoji: string;
  heroLine1: string;
  heroLine2: string;
  description: string;
  worksSubtitle: string;
  works: WorkItem[];
  packages: [ServicePackage, ServicePackage];
  extras: ExtraService[];
  ctaEmoji: string;
  ctaTitle: string;
  ctaDesc: string;
}

const gText: CSSProperties = {
  background: 'linear-gradient(135deg, #d63384 0%, #a855f7 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const primaryBtn: CSSProperties = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #d63384, #a855f7)',
  color: '#fff',
  padding: '13px 28px',
  borderRadius: '30px',
  fontWeight: 700,
  fontSize: '15px',
  cursor: 'pointer',
  textDecoration: 'none',
  border: 'none',
};

const secondaryBtn: CSSProperties = {
  display: 'inline-block',
  background: 'transparent',
  color: '#fff',
  padding: '13px 28px',
  borderRadius: '30px',
  fontWeight: 700,
  fontSize: '15px',
  border: '1px solid rgba(255,255,255,0.28)',
  cursor: 'pointer',
  textDecoration: 'none',
};

function wa(text: string) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
}

function PackageCard({ pkg }: { pkg: ServicePackage }) {
  const link = wa(`Хочу заказать пакет ${pkg.tier} — ${pkg.title}`);
  return (
    <div style={{
      background: pkg.popular ? 'linear-gradient(160deg, #3a0050 0%, #1c0040 100%)' : '#1a0b2e',
      borderRadius: '18px',
      padding: '28px',
      border: pkg.popular ? '1px solid rgba(214, 51, 132, 0.55)' : '1px solid rgba(255,255,255,0.09)',
      boxShadow: pkg.popular ? '0 0 40px rgba(214, 51, 132, 0.12)' : 'none',
      position: 'relative',
    }}>
      {pkg.popular && (
        <div style={{
          position: 'absolute',
          top: '-13px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #d63384, #a855f7)',
          color: '#fff',
          padding: '4px 18px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          letterSpacing: '0.5px',
        }}>
          ✨ ПОПУЛЯРНЫЙ
        </div>
      )}

      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '6px' }}>
        {pkg.tier}
      </div>
      <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '12px' }}>{pkg.title}</div>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
          {pkg.price.toLocaleString('ru-RU')}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>сом</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'line-through' }}>
          {pkg.oldPrice.toLocaleString('ru-RU')} сом
        </span>
      </div>

      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '12px' }}>
        ЧТО ВХОДИТ:
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
        {pkg.items.map((item, i) => (
          <li key={i} style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.82)',
            padding: '6px 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            lineHeight: 1.4,
          }}>
            {item}
          </li>
        ))}
      </ul>

      <a href={link} target="_blank" rel="noopener noreferrer" style={{
        display: 'block',
        textAlign: 'center',
        padding: '13px',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '14px',
        background: pkg.popular ? 'linear-gradient(135deg, #d63384, #a855f7)' : 'transparent',
        border: pkg.popular ? 'none' : '1px solid rgba(214, 51, 132, 0.55)',
        color: '#fff',
        marginBottom: '12px',
        textDecoration: 'none',
      }}>
        Заказать этот пакет
      </a>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.38)', fontSize: '12px' }}>
        🚗 Выезд и установка по городу — бесплатно
      </div>
    </div>
  );
}

export default function ServicePage({
  emoji, heroLine1, heroLine2, description,
  worksSubtitle, works, packages, extras,
  ctaEmoji, ctaTitle, ctaDesc,
}: ServicePageProps) {
  const [pkg1, pkg2] = packages;

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg, #1c0038 0%, #0d0118 100%)',
        padding: '72px 20px 80px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '52px', marginBottom: '20px' }}>{emoji}</div>
        <h1 style={{ fontSize: 'clamp(2rem, 6.5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 18px', color: '#fff' }}>
          {heroLine1}<br />
          <span style={gText}>{heroLine2}</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.65 }}>
          {description}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <a href={wa('Хочу посмотреть пакеты')} target="_blank" rel="noopener noreferrer" style={primaryBtn}>
            Посмотреть пакеты
          </a>
          <a href={wa('Хочу бесплатную консультацию')} target="_blank" rel="noopener noreferrer" style={secondaryBtn}>
            Бесплатная консультация
          </a>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>
          🚗 Выезд и установка по городу — бесплатно
        </div>
      </section>

      {/* Our Works */}
      <section style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.5rem)', fontWeight: 900, margin: '0 0 10px' }}>
            Наши <span style={gText}>работы</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: 0 }}>{worksSubtitle}</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}>
          {works.map((w, i) => (
            <div key={i} style={{
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#1a0b2e',
              border: '1px solid rgba(214, 51, 132, 0.14)',
            }}>
              <div style={{
                height: '210px',
                background: w.gradient,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
              }}>
                {w.emoji}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{w.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{w.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href={IG} target="_blank" rel="noopener noreferrer" style={{ color: '#d63384', fontSize: '14px', fontWeight: 600 }}>
            Больше фото и видео @marryme_007 →
          </a>
        </div>
      </section>

      {/* Packages */}
      <section style={{ padding: '0 20px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.5rem)', fontWeight: 900, margin: '0 0 10px' }}>
            Пакеты и <span style={gText}>цены</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: 0 }}>
            Выберите оформление — мы позаботимся обо всём остальном
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <PackageCard pkg={pkg1} />
          <PackageCard pkg={pkg2} />
        </div>

        {/* Extras */}
        <div style={{
          background: '#1a0b2e',
          borderRadius: '14px',
          padding: '24px',
          border: '1px solid rgba(214, 51, 132, 0.13)',
        }}>
          <div style={{ textAlign: 'center', color: '#d63384', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '20px' }}>
            ✨ ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            {extras.map((e, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '30px', marginBottom: '6px' }}>{e.emoji}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>{e.title}</div>
                <div style={{ color: '#d63384', fontSize: '12px' }}>{e.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(180deg, #0d0118 0%, #1c0035 100%)',
        padding: '80px 20px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>{ctaEmoji}</div>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.5rem)', fontWeight: 900, margin: '0 0 16px' }}>
          <span style={gText}>{ctaTitle}</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.65 }}>
          {ctaDesc}
        </p>
        <a href={wa('Хочу заказать')} target="_blank" rel="noopener noreferrer" style={primaryBtn}>
          💬 Написать в WhatsApp
        </a>
        <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '12px', marginTop: '12px' }}>
          Ответим в течение 5 минут
        </div>
      </section>
    </div>
  );
}
