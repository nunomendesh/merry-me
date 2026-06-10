'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Row, Col, Typography, Tabs, Button, Rate, Space, Tag, Image, Grid } from 'antd';
import { TrophyOutlined, IdcardOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;
import { doctorsData } from '../data/doctorsData';
import Link from 'next/link'; // Added Link

const { Title, Paragraph, Text } = Typography;

export default function DoctorsPage() {
    const router = useRouter();
    const screens = useBreakpoint();
    const isMobile = screens.xs || (screens.sm && !screens.md);
    const [activeTab, setActiveTab] = useState<string>('all');

    // Функция перенаправления на главную с параметром выбранного врача
    const handleDirectBooking = (doctorName: string) => {
        const encodedName = encodeURIComponent(doctorName);
        router.push(`/?doctor=${encodedName}`);
    };

    // Фильтруем массив в зависимости от выбранной вкладки
    const filteredDoctors = activeTab === 'all'
        ? doctorsData
        : doctorsData.filter(doc => doc.specialty === activeTab);

    // Конфигурация вкладок для Ant Design Tabs
    const tabItems = [
        { key: 'all', label: 'Все специалисты' },
        { key: 'uzi', label: 'Врачи УЗИ' }, // Обновлены названия вкладок
        { key: 'therapist', label: 'Терапевты' },
        { key: 'surgeon', label: 'Хирурги' },
        { key: 'pediatrician', label: 'Педиатры' },
    ];

    return (
        <div style={{ padding: isMobile ? '16px' : '40px 24px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
                <Title level={1}>Наши Специалисты</Title>
                <Paragraph style={{ fontSize: isMobile ? '14px' : '16px', color: '#8c8c8c' }}>
                    Высококвалифицированные врачи нашего центра всегда готовы помочь вам и вашему здоровью.
                </Paragraph>
            </div>

            {/* Переключатель категорий врачей */}
            <Tabs
                defaultActiveKey="all"
                centered
                items={tabItems}
                onChange={(key) => setActiveTab(key)}
                style={{ marginBottom: '32px' }}
            />

            {/* Сетка карточек специалистов */}
            <Row gutter={[24, 24]}>
                {filteredDoctors.map((doctor) => (
                    <Col key={doctor.id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            style={{ height: '100%', textAlign: 'center', borderRadius: '12px', overflow: 'hidden' }}
                            styles={{ body: { padding: '24px 16px' } }}
                        >
                            {/* Аватар-картинка */}
                            <Image
                                src={doctor.avatar}
                                alt={doctor.name}
                                width={90}
                                height={90}
                                style={{
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    margin: '0 auto 16px auto',
                                    border: '2px solid #1890ff' // Добавим рамку для акцента
                                }}
                            />

                            <Tag color="blue" style={{ marginBottom: '8px' }}>
                                {doctor.specialtyLabel}
                            </Tag>

                            <Title level={4} style={{ margin: '8px 0', fontSize: '18px', minHeight: '48px' }}>
                                {doctor.name}
                            </Title>

                            <div style={{ marginBottom: '12px' }}>
                                <Rate disabled allowHalf defaultValue={doctor.rating} style={{ fontSize: '14px' }} />
                                <span style={{ marginLeft: '8px', color: '#faad14', fontWeight: 'bold' }}>{doctor.rating}</span>
                            </div>

                            <div style={{ width: '100%', marginBottom: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <Text type="secondary" style={{ fontSize: '13px' }}>
                                    <TrophyOutlined style={{ marginRight: '6px' }} />
                                    Стаж работы: <strong>{doctor.experience} лет</strong>
                                </Text>
                                <Text type="secondary" style={{ fontSize: '13px' }}>
                                    <IdcardOutlined style={{ marginRight: '6px' }} />
                                    {doctor.qualification}
                                </Text>
                            </div>

                            <Space>
                                {/* Ссылка на детальную страницу врача */}
                                <Link href={`/doctors/${doctor.id}`}>
                                    <Button type="link" size="middle" icon={<ArrowRightOutlined />}>
                                        Подробнее
                                    </Button>
                                </Link>
                                {/* Кнопка записи, которая предзаполняет врача */}
                                <Button
                                    type="primary"
                                    shape="round"
                                    onClick={() => handleDirectBooking(doctor.name)}
                                >
                                    Записаться
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}