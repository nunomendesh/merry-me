'use client'; // Переводим layout в режим клиентского компонента для работы сusePathname

import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Импортируем хук для определения текущего роута

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname(); // Получаем текущий путь (например: "/", "/services", "/profile", "/admin")

    // Функция для определения стилей ссылки в зависимости от того, активна она или нет
    const getLinkStyle = (isActive: boolean) => ({
        color: isActive ? '#1890ff' : '#8c8c8c', // Фирменный синий, если активна, иначе — серый
        fontWeight: isActive ? 600 : 400,        // Полужирный для активной, обычный для остальных
        textDecoration: 'none',
        fontSize: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'color 0.2s ease, font-weight 0.2s ease' // Плавный переход цвета при переключении
    });

    return (
        <html lang="ru">
        <body className={inter.className} style={{ margin: 0, padding: 0, background: '#f8fafc' }}>

        {/* КРАСИВАЯ ШАПКА САЙТА */}
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxSizing: 'border-box'
        }}>
            {/* Логотип / Название клиники */}
            <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#1890ff', letterSpacing: '0.5px' }}>
              🏥 МЕД-ЦЕНТР
            </span>
            </Link>

            {/* Навигационное меню */}
            <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>

                <Link href="/" style={getLinkStyle(pathname === '/')}>
                    Главная
                </Link>

                <Link href="/services" style={getLinkStyle(pathname === '/services')}>
                    Услуги и цены
                </Link>

                <Link href="/profile" style={getLinkStyle(pathname === '/profile')}>
                    👤 Личный кабинет
                </Link>

                <Link href="/admin" style={getLinkStyle(pathname === '/admin')}>
                    Админка
                </Link>

            </nav>
        </header>

        {/* Контент текущей страницы */}
        <main>
            {children}
        </main>

        </body>
        </html>
    );
}