// app/doctors/[doctorId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Card, Space, Tag, Button, List, Divider, Rate, Empty, Image } from 'antd';
import {
    TrophyOutlined, IdcardOutlined, CalendarOutlined, BookOutlined, UserOutlined, ClockCircleOutlined, StarOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { doctorsData, IDoctor } from '../../data/doctorsData';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

interface DoctorDetailPageProps {
    params: {
        doctorId: string;
    };
}

interface IReview {
    id: string;
    author: string;
    doctorName: string; // Используется для фильтрации отзывов
    rating: number;
    content: string;
    date: string;
}

export default function DoctorDetailPage({ params }: DoctorDetailPageProps) {
    const router = useRouter();
    const { doctorId } = params;
    const [doctorReviews, setDoctorReviews] = useState<IReview[]>([]);

    const doctor: IDoctor | undefined = doctorsData.find(doc => doc.id === doctorId);

    useEffect(() => {
        if (doctor) {
            const savedReviews = localStorage.getItem('med-reviews');
            if (savedReviews) {
                const allReviews: IReview[] = JSON.parse(savedReviews);
                // Фильтруем отзывы, относящиеся только к текущему врачу
                const filteredReviews = allReviews.filter(
                    (review) => review.doctorName === doctor.name
                );
                setDoctorReviews(filteredReviews);
            }
        }
    }, [doctor]); // Перезагружаем отзывы при изменении врача

    if (!doctor) {
        notFound(); // Выводим 404, если врач не найден
    }

    const handleBookingRedirect = () => {
        const encodedDoctor = encodeURIComponent(doctor.name);
        router.push(`/?doctor=${encodedDoctor}`);
    };

    return (
        <div style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto', minHeight: '100vh' }}>
            <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => router.back()} style={{ marginBottom: '24px', paddingLeft: 0 }}>
                Назад ко всем врачам
            </Button>

            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} variant="borderless">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        <Image
                            src={doctor.avatar}
                            alt={doctor.name}
                            width={120}
                            height={120}
                            style={{ borderRadius: '50%', objectFit: 'cover', border: '3px solid #1890ff' }}
                        />
                        <div>
                            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                {doctor.name}
                            </Title>
                            <Tag color="blue" style={{ marginTop: '8px', fontSize: '14px', padding: '4px 8px' }}>
                                {doctor.specialtyLabel}
                            </Tag>
                            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                                <Rate disabled allowHalf defaultValue={doctor.rating} style={{ fontSize: '16px' }} />
                                <span style={{ marginLeft: '8px', color: '#faad14', fontWeight: 'bold', fontSize: '16px' }}>{doctor.rating}</span>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <div>
                        <Title level={4}>
                            <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                            О враче
                        </Title>
                        <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                            {doctor.bio}
                        </Paragraph>
                    </div>

                    <div>
                        <Title level={4} style={{ marginTop: '24px' }}>
                            <BookOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                            Образование
                        </Title>
                        <List
                            dataSource={doctor.education}
                            renderItem={(item) => (
                                <List.Item style={{ borderBottom: 'none', padding: '8px 0' }}>
                                    <Text>{item}</Text>
                                </List.Item>
                            )}
                            size="small"
                            split={false}
                        />
                    </div>

                    {doctor.certificates.length > 0 && (
                        <div>
                            <Title level={4} style={{ marginTop: '24px' }}>
                                <TrophyOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                                Квалификация и сертификаты
                            </Title>
                            <List
                                dataSource={doctor.certificates}
                                renderItem={(item) => (
                                    <List.Item style={{ borderBottom: 'none', padding: '8px 0' }}>
                                        <Text>{item}</Text>
                                    </List.Item>
                                )}
                                size="small"
                                split={false}
                            />
                        </div>
                    )}

                    <div>
                        <Title level={4} style={{ marginTop: '24px' }}>
                            <CalendarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                            График приема
                        </Title>
                        <Paragraph style={{ fontSize: '15px' }}>
                            {doctor.schedule}
                        </Paragraph>
                    </div>

                    <Divider />

                    <div>
                        <Title level={4} style={{ marginTop: '24px' }}>
                            <StarOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                            Отзывы о враче ({doctorReviews.length})
                        </Title>
                        <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                            {doctorReviews.length === 0 ? (
                                <Empty
                                    description="Отзывов для этого врача пока нет. Будьте первым!"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    style={{ padding: '24px 0' }}
                                />
                            ) : (
                                <List
                                    dataSource={doctorReviews}
                                    renderItem={(review) => (
                                        <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                                            <div style={{ width: '100%' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <strong style={{ fontSize: '14px', color: '#1e293b' }}>{review.author}</strong>
                                                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>{review.date}</span>
                                                </div>
                                                <Rate disabled defaultValue={review.rating} style={{ fontSize: '13px', marginBottom: '8px' }} />
                                                <Paragraph style={{ margin: 0, color: '#334155', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                                                    {review.content}
                                                </Paragraph>
                                            </div>
                                        </List.Item>
                                    )}
                                    size="small"
                                    split={false}
                                />
                            )}
                        </div>
                    </div>


                    <Button type="primary" size="large" block onClick={handleBookingRedirect} style={{ marginTop: '24px' }}>
                        Записаться на прием к {doctor.specialtyLabel}у {doctor.name}
                    </Button>
                </Space>
            </Card>
        </div>
    );
}