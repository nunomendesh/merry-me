import React from 'react';
import Link from 'next/link';
import type { CSSProperties } from 'react';

const SERVICES = [
  {
    href: '/proposal',
    emoji: '💍',
    title: 'Предложение руки и сердца',
    desc: 'Создадим незабываемый романтический вечер',
    badge: 'Хит',
    bg: 'linear-gradient(160deg, #3b0045 0%, #180032 60%, #0d0020 100%)',
  },
  {
    href: '/mama',
    emoji: '💐',
    title: 'Сюрприз для мамы',
    desc: 'Подарите маме момент, который она запомнит навсегда',
    bg: 'linear-gradient(160deg, #001a40 0%, #0d0030 60%, #1a000d 100%)',
  },
  {
    href: '/birthday',
    emoji: '🎂',
    title: 'День рождения',
    desc: 'Яркое оформление и сюрпризы для именинника',
    bg: 'linear-gradient(160deg, #200045 0%, #2d0025 60%, #0d001a 100%)',
  },
];

const STEPS = [
  { num: '01', title: 'Пишете нам', desc: 'Напишите в WhatsApp — обсудим детали, дату и место.' },
  { num: '02', title: 'Выбираете пакет', desc: 'Подберём оформление под ваш бюджет и пожелания.' },
  { num: '03', title: 'Мы всё делаем', desc: 'Приезжаем, устанавливаем декор, настраиваем музыку.' },
  { num: '04', title: 'Вы наслаждаетесь', desc: 'Вам остаётся только сказать главные слова 💍' },
];

const gText: CSSProperties = {
  background: 'linear-gradient(135deg, #d63384 0%, #a855f7 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function HomePage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 20px 96px' }}>

      {/* Hero */}
      <section style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ fontSize: '36px', marginBottom: '20px' }}>✨</div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 7vw, 4rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 18px', color: '#fff' }}>
          Какие услуги вас<br />
          <span style={gText}>интересуют?</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', margin: 0 }}>
          Выберите категорию — мы создадим незабываемый момент
        </p>
      </section>

      {/* Service Cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '20px',
        marginBottom: '100px',
      }}>
        {SERVICES.map((s) => (
          <Link key={s.href} href={s.href} style={{ display: 'block' }}>
            <div style={{
              background: '#1a0b2e',
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid rgba(214, 51, 132, 0.2)',
              height: '100%',
            }}>
              <div style={{
                height: '200px',
                background: s.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '56px',
                position: 'relative',
              }}>
                {s.badge && (
                  <div style={{
                    position: 'absolute', top: '14px', left: '14px',
                    background: '#d63384',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}>
                    {s.badge}
                  </div>
                )}
                {s.emoji}
              </div>
              <div style={{ padding: '22px 20px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 10px', color: '#fff' }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '13px', lineHeight: 1.55, margin: '0 0 18px' }}>
                  {s.desc}
                </p>
                <div style={{ color: '#d63384', fontSize: '14px', fontWeight: 600 }}>Подробнее →</div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* How it works */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, margin: '0 0 10px' }}>
            Как это <span style={gText}>работает</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', margin: 0 }}>Всего 4 простых шага</p>
        </div>

        <div style={{ maxWidth: '620px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {STEPS.map((s) => (
            <div key={s.num} style={{
              background: '#1a0b2e',
              border: '1px solid rgba(214, 51, 132, 0.14)',
              borderRadius: '14px',
              padding: '20px 22px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}>
              <div style={{
                background: 'rgba(214, 51, 132, 0.15)',
                color: '#d63384',
                width: '42px', height: '42px',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '13px',
                flexShrink: 0,
              }}>
                {s.num}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '5px' }}>{s.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.58)', fontSize: '13px', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
