// app/services/[categorySlug]/[serviceSlug]/page.tsx
'use client';

import React from 'react';
import { Typography, Card, Space, Tag, Button, List, Divider, Empty } from 'antd'; // ИСПРАВЛЕНО: message удален, так как не используется
import {
    ClockCircleOutlined, DollarCircleOutlined, BookOutlined, ExclamationCircleOutlined, CheckCircleOutlined, ArrowLeftOutlined
} from '@ant-design/icons';

import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import {servicesData} from "@/app/data/servicesData";

const { Title, Paragraph, Text } = Typography;

interface ServiceDetailPageProps {
    params: {
        categorySlug: string;
        serviceSlug: string;
    };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
    const router = useRouter();
    const { categorySlug, serviceSlug } = params;

    const category = servicesData.find(cat => cat.slug === categorySlug);
    if (!category) {
        notFound();
    }

    const service = category.services.find(svc => svc.slug === serviceSlug);
    if (!service) {
        notFound();
    }

    const handleBookingRedirect = () => {
        const encodedService = encodeURIComponent(service.name);
        router.push(`/?service=${encodedService}`);
    };

    return (
        <div style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto', minHeight: '100vh' }}>
            <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => router.back()} style={{ marginBottom: '24px', paddingLeft: 0 }}>
                Назад ко всем услугам
            </Button>

            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} variant="borderless">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                {service.name}
                            </Title>
                            <Paragraph type="secondary" style={{ fontSize: '15px' }}>
                                Категория: <Link href={`/services#${category.id}`} style={{ color: '#1890ff', textDecoration: 'underline' }}>{category.name}</Link>
                            </Paragraph>
                        </div>
                        <Space size="large" align="center">
                            <Tag color="green" style={{ fontSize: '16px', padding: '6px 12px', borderRadius: '4px' }}>
                                <DollarCircleOutlined /> {service.price} сом
                            </Tag>
                            {service.durationMinutes && (
                                <Tag color="blue" style={{ fontSize: '16px', padding: '6px 12px', borderRadius: '4px' }}>
                                    <ClockCircleOutlined /> {service.durationMinutes} мин
                                </Tag>
                            )}
                        </Space>
                    </div>

                    <Divider />

                    {service.description && (
                        <div>
                            <Title level={4}>Описание услуги</Title>
                            <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                                {service.description}
                            </Paragraph>
                        </div>
                    )}

                    {service.preparation && service.preparation.length > 0 && (
                        <div>
                            <Title level={4} style={{ marginTop: '24px' }}>
                                <BookOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                                Подготовка к процедуре
                            </Title>
                            <List
                                dataSource={service.preparation}
                                renderItem={(item: string) => ( // ИСПРАВЛЕНО: Явно указан тип item
                                    <List.Item style={{ borderBottom: 'none', padding: '8px 0' }}>
                                        <Text><CheckCircleOutlined style={{ marginRight: '8px', color: '#52c41a' }} />{item}</Text>
                                    </List.Item>
                                )}
                                size="small"
                                split={false}
                            />
                        </div>
                    )}

                    {service.indications && service.indications.length > 0 && (
                        <div>
                            <Title level={4} style={{ marginTop: '24px' }}>
                                <CheckCircleOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                                Показания к проведению
                            </Title>
                            <List
                                dataSource={service.indications}
                                renderItem={(item: string) => ( // ИСПРАВЛЕНО: Явно указан тип item
                                    <List.Item style={{ borderBottom: 'none', padding: '8px 0' }}>
                                        <Text>{item}</Text>
                                    </List.Item>
                                )}
                                size="small"
                                split={false}
                            />
                        </div>
                    )}

                    {service.contraindications && service.contraindications.length > 0 && (
                        <div>
                            <Title level={4} style={{ marginTop: '24px' }}>
                                <ExclamationCircleOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
                                Противопоказания
                            </Title>
                            <List
                                dataSource={service.contraindications}
                                renderItem={(item: string) => ( // ИСПРАВЛЕНО: Явно указан тип item
                                    <List.Item style={{ borderBottom: 'none', padding: '8px 0' }}>
                                        <Text type="danger">{item}</Text>
                                    </List.Item>
                                )}
                                size="small"
                                split={false}
                            />
                        </div>
                    )}

                    <Divider />

                    <Button type="primary" size="large" block onClick={handleBookingRedirect} style={{ marginTop: '24px' }}>
                        Записаться на услугу
                    </Button>
                </Space>
            </Card>
        </div>
    );
}