'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Drawer, Grid } from 'antd';
import { MenuOutlined, HomeOutlined, CustomerServiceOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const screens = useBreakpoint();
    const pathname = usePathname();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [clinicName, setClinicName] = useState('МЕД-ЦЕНТР');

    useEffect(() => {
        fetch('/api/data.json')
            .then((res) => { if (res.ok) return res.json(); })
            .then((data) => {
                if (data?.settings?.clinicName) {
                    setClinicName(data.settings.clinicName.toUpperCase());
                }
            })
            .catch(() => console.log('Используется дефолтное название'));
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
                zIndex: 1001, // Увеличили Z-index, чтобы Header всегда был поверх всего
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                padding: isMobile ? '0 16px' : '0 40px',
                height: '64px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link href="/" style={{ fontWeight: 'bold', fontSize: '18px', color: '#1890ff' }}>
                        🏢 {clinicName}
                    </Link>
                </div>

                {!isMobile && (
                    <Menu
                        mode="horizontal"
                        selectedKeys={[pathname]}
                        items={menuItems}
                        style={{ borderBottom: 'none', minWidth: '400px', justifyContent: 'end' }}
                    />
                )}

                {isMobile && (
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: '18px' }} />}
                        onClick={() => setIsDrawerVisible(true)}
                    />
                )}

                {/* Drawer теперь стандартный, без getContainer={false},
                    но мы добавили zIndex, чтобы он был выше всех слоев */}
                <Drawer
                    title="Навигация"
                    placement="left"
                    onClose={() => setIsDrawerVisible(false)}
                    open={isDrawerVisible}
                    width={280}
                    zIndex={1002}
                    styles={{
                        body: { padding: '16px 0' } // Убираем боковые отступы вообще
                    }}
                >
                    <Menu
                        mode="vertical"
                        selectedKeys={[pathname]}
                        items={menuItems}
                        onClick={() => setIsDrawerVisible(false)}
                        // Добавляем этот стиль, чтобы иконки стали ближе к левому краю
                        style={{
                            borderRight: 'none',
                            fontSize: '16px'
                        }}
                        // И используем свойство itemStyle (если версия Antd позволяет)
                        // или просто настроим отступы пунктов меню через CSS
                    />
                </Drawer>
            </Header>

            <Content style={{ background: '#f8fafc' }}>
                {children}
            </Content>

            <Footer style={{ textAlign: 'center', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                © {new Date().getFullYear()} {clinicName}
            </Footer>
        </Layout>
        </body>
        </html>
    );
}