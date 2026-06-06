'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Drawer, Grid } from 'antd';
import { MenuOutlined, HomeOutlined, CustomerServiceOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

interface IClinicSettings {
    clinicName: string;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const screens = useBreakpoint();
    const pathname = usePathname();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    // Динамическое состояние для названия клиники в шапке
    const [clinicSettings, setClinicSettings] = useState<IClinicSettings>({
        clinicName: 'МЕД-ЦЕНТР'
    });

    useEffect(() => {
        // Подгружаем настройки клиники, чтобы шапка тоже была динамической White Label
        fetch('/api/data.json')
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error('Ошибка сети');
            })
            .then((data) => {
                if (data && data.settings && data.settings.clinicName) {
                    setClinicSettings({ clinicName: data.settings.clinicName.toUpperCase() });
                }
            })
            .catch((err) => console.log('Используется дефолтное название в Header:', err));
    }, []);

    const isMobile = screens.xs || (screens.sm && !screens.md);

    const menuItems = [
        { key: '/', label: <Link href="/">Главная</Link>, icon: <HomeOutlined /> },
        { key: '/services', label: <Link href="/services">Услуги и цены</Link>, icon: <CustomerServiceOutlined /> },
        { key: '/profile', label: <Link href="/profile">Личный кабинет</Link>, icon: <UserOutlined /> },
        { key: '/admin', label: <Link href="/admin">Админка</Link>, icon: <SettingOutlined /> },
    ];

    return (
        <html lang="ru">
        <body>
        <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Header style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                padding: isMobile ? '0 16px' : '0 40px',
                height: '64px'
            }}>
                {/* Динамический логотип */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link href="/" style={{ fontWeight: 'bold', fontSize: '18px', color: '#1890ff', letterSpacing: '0.5px' }}>
                        🏢 {clinicSettings.clinicName}
                    </Link>
                </div>

                {/* Десктопное меню */}
                {!isMobile && (
                    <Menu
                        mode="horizontal"
                        selectedKeys={[pathname]}
                        items={menuItems}
                        style={{ borderBottom: 'none', minWidth: '400px', justifyContent: 'end' }}
                    />
                )}

                {/* Мобильная кнопка меню */}
                {isMobile && (
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: '18px' }} />}
                        onClick={() => setIsDrawerVisible(true)}
                    />
                )}

                {/* Исправленный мобильный Drawer (убрали deprecated width) */}
                <Drawer
                    title="Навигация"
                    placement="right"
                    onClose={() => setIsDrawerVisible(false)}
                    open={isDrawerVisible}
                    style={{ width: '280px' }} // Задаем ширину через встроенные стили корректно
                >
                    <Menu
                        mode="vertical"
                        selectedKeys={[pathname]}
                        items={menuItems}
                        onClick={() => setIsDrawerVisible(false)}
                        style={{ borderRight: 'none' }}
                    />
                </Drawer>
            </Header>

            <Content style={{ background: '#f8fafc' }}>
                {children}
            </Content>

            <Footer style={{ textAlign: 'center', background: '#ffffff', color: '#64748b', borderTop: '1px solid #e2e8f0', padding: '20px' }}>
                © {new Date().getFullYear()} {clinicSettings.clinicName} — Платформа онлайн-записи. Все права защищены.
            </Footer>
        </Layout>
        </body>
        </html>
    );
}