'use client';

import React from 'react';
import { Row, Col, Card, Typography, Tag, Space, Divider, Button, Grid } from 'antd';

const { useBreakpoint } = Grid;
import {
    ExperimentOutlined,
    HeartOutlined,
    MedicineBoxOutlined,
    ClockCircleOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { servicesData } from '../data/servicesData'; // ИСПРАВЛЕНО: Теперь servicesData берется из data-файла
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Title, Paragraph, Text } = Typography;

export default function ServicesPage() {
    const router = useRouter();
    const screens = useBreakpoint();
    const isMobile = screens.xs || (screens.sm && !screens.md);

    const getCategoryIcon = (iconName: string | undefined) => { // ИСПРАВЛЕНО: iconName может быть undefined
        switch (iconName) {
            case 'ultrasound':
                return <HeartOutlined style={{ fontSize: '20px' }} />;
            case 'test-tube':
                return <ExperimentOutlined style={{ fontSize: '20px' }} />;
            case 'doctor':
                return <MedicineBoxOutlined style={{ fontSize: '20px' }} />;
            default:
                return <MedicineBoxOutlined style={{ fontSize: '20px' }} />;
        }
    };

    const handleBookingRedirect = (serviceName: string) => {
        const encodedService = encodeURIComponent(serviceName);
        router.push(`/?service=${encodedService}`);
    };

    return (
        <div style={{ padding: isMobile ? '16px' : '40px 24px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
                <Title level={1}>Наши Услуги и Прайс-лист</Title>
                <Paragraph style={{ fontSize: isMobile ? '14px' : '16px', color: '#8c8c8c' }}>
                    Выберите интересующее вас направление, ознакомьтесь с ценами и запишитесь на прием онлайн за пару кликов.
                </Paragraph>
            </div>

            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                {servicesData.map((category) => (
                    <div key={category.id} style={{ marginBottom: '32px' }}>
                        <Title level={2} style={{ marginBottom: '16px', color: '#1890ff' }}>
                            <Space>
                                {getCategoryIcon(category.icon)} {/* ИСПРАВЛЕНО: Передаем category.icon напрямую */}
                                {category.name}
                            </Space>
                        </Title>
                        <Paragraph style={{ fontSize: '16px', color: '#555', marginBottom: '24px' }}>
                            {category.description}
                        </Paragraph>

                        <Row gutter={[16, 16]}>
                            {category.services.map((service) => (
                                <Col key={service.id} xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Card
                                        hoverable
                                        title={<span style={{ fontSize: '16px', fontWeight: 600 }}>{service.name}</span>}
                                        extra={<Tag color="green" style={{ fontSize: '14px', padding: '4px 8px' }}>{service.price} сом</Tag>}
                                        style={{ height: '100%', borderRadius: '8px' }}
                                        variant="borderless"
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                            <Paragraph type="secondary" style={{ minHeight: '44px', marginBottom: '12px' }}>
                                                {service.description}
                                            </Paragraph>

                                            <Divider style={{ margin: '12px 0' }} />

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                                {service.durationMinutes && ( // ИСПРАВЛЕНО: Проверяем наличие durationMinutes
                                                    <Space size="small">
                                                        <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
                                                        <Text type="secondary" style={{ fontSize: '13px' }}>
                                                            Длительность: {service.durationMinutes} мин
                                                        </Text>
                                                    </Space>
                                                )}
                                                <Space>
                                                    <Link href={`/services/${category.slug}/${service.slug}`}>
                                                        <Button type="link" size="small" icon={<ArrowRightOutlined />} style={{ padding: '0 4px' }}>
                                                            Подробнее
                                                        </Button>
                                                    </Link>
                                                    <Button type="primary" size="small" onClick={() => handleBookingRedirect(service.name)}>
                                                        Записаться
                                                    </Button>
                                                </Space>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}
            </div>
        </div>
    );
}