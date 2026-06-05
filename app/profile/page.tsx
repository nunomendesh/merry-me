'use client';

import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Table, Tag, Modal, message, Empty } from 'antd';
import { UserOutlined, PhoneOutlined, CalendarOutlined, ClockCircleOutlined, LogoutOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface IBooking {
    id: string;
    name: string;
    phone: string;
    service: string;
    doctor?: string; // ИСПРАВЛЕНО: doctor может быть необязательным
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
    const [userBookings, setUserBookings] = useState<IBooking[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const savedUser = localStorage.getItem('med-current-user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            loadUserBookings(parsedUser.name, parsedUser.phone);
        }
    }, []);

    const loadUserBookings = (name: string, phone: string) => {
        const allBookingsRaw = localStorage.getItem('med-bookings');
        if (allBookingsRaw) {
            try { // ИСПРАВЛЕНО: Добавлен try-catch для парсинга localStorage
                const allBookings: IBooking[] = JSON.parse(allBookingsRaw);
                const filtered = allBookings.filter(
                    (b) => b.name.trim().toLowerCase() === name.trim().toLowerCase() && b.phone.trim() === phone.trim()
                );
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setUserBookings(filtered);
            } catch (e) {
                console.error('Ошибка парсинга данных о бронированиях из localStorage', e);
                message.error('Ошибка загрузки ваших записей.');
            }
        }
    };

    const handleLogin = (values: { name: string; phone: string }) => {
        localStorage.setItem('med-current-user', JSON.stringify(values));
        setUser(values);
        loadUserBookings(values.name, values.phone);
        message.success(`Добро пожаловать, ${values.name}!`);
    };

    const handleLogout = () => {
        localStorage.removeItem('med-current-user');
        setUser(null);
        setUserBookings([]);
        form.resetFields();
        message.info('Вы вышли из личного кабинета.');
    };

    const handleCancelBooking = (bookingId: string) => {
        Modal.confirm({
            title: 'Вы уверены, что хотите отменить эту запись?',
            content: 'Это действие нельзя будет отменить.',
            okText: 'Да, отменить',
            okType: 'danger',
            cancelText: 'Назад',
            onOk() {
                const allBookingsRaw = localStorage.getItem('med-bookings');
                if (allBookingsRaw) {
                    try { // ИСПРАВЛЕНО: Добавлен try-catch для парсинга localStorage
                        const allBookings: IBooking[] = JSON.parse(allBookingsRaw);
                        const updatedBookings = allBookings.map((b) =>
                            b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
                        );
                        localStorage.setItem('med-bookings', JSON.stringify(updatedBookings));

                        if (user) {
                            loadUserBookings(user.name, user.phone);
                        }
                        message.success('Запись успешно отменена.');
                    } catch (e) {
                        console.error('Ошибка при отмене записи из localStorage', e);
                        message.error('Ошибка при отмене записи. Пожалуйста, попробуйте еще раз.');
                    }
                }
            },
        });
    };

    const renderStatusTag = (status: IBooking['status']) => {
        switch (status) {
            case 'pending':
                return <Tag icon={<SyncOutlined spin />} color="processing">Ожидает подтверждения</Tag>;
            case 'confirmed':
                return <Tag icon={<CheckCircleOutlined />} color="success">Подтвержден</Tag>;
            case 'cancelled':
                return <Tag icon={<CloseCircleOutlined />} color="error">Отменен</Tag>;
            case 'completed':
                return <Tag icon={<CheckCircleOutlined />} color="blue">Завершен</Tag>;
            default:
                return <Tag color="default">Неизвестно</Tag>;
        }
    };

    const columns = [
        {
            title: 'Услуга / Направление',
            dataIndex: 'service',
            key: 'service',
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'Специалист',
            dataIndex: 'doctor',
            key: 'doctor',
            render: (doctorName: string | undefined) => doctorName || 'Не назначен', // ИСПРАВЛЕНО: Отображаем "Не назначен" если врач не указан
        },
        {
            title: 'Дата и время визита',
            key: 'dateTime',
            render: (_: any, record: IBooking) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span><CalendarOutlined style={{ marginRight: '6px' }} /> {record.date}</span>
                    <Text type="secondary"><ClockCircleOutlined style={{ marginRight: '6px' }} /> {record.time}</Text>
                </div>
            ),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: IBooking['status']) => renderStatusTag(status),
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_: any, record: IBooking) => (
                (record.status === 'pending' || record.status === 'confirmed') ? (
                    <Button type="link" danger onClick={() => handleCancelBooking(record.id)}>
                        Отменить визит
                    </Button>
                ) : (
                    <Text type="secondary" disabled>Недоступно</Text>
                )
            ),
        },
    ];

    return (
        <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' }}>
            {!user ? (
                <Card style={{ maxWidth: '450px', margin: '60px auto 0 auto', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <Title level={2}>Вход в кабинет</Title>
                        <Paragraph type="secondary">Введите ваше имя и телефон, указанные при записи, чтобы посмотреть историю визитов.</Paragraph>
                    </div>

                    <Form form={form} layout="vertical" onFinish={handleLogin} requiredMark={false}>
                        <Form.Item
                            name="name"
                            label="Ваше ФИО"
                            rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Иванов Иван" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Номер телефона"
                            rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="+996 (555) 00-00-00" size="large" />
                        </Form.Item>

                        <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" size="large" block>
                                Войти в кабинет
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            ) : (
                <div>
                    <Card style={{ marginBottom: '24px', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <Title level={3} style={{ margin: 0 }}>Личный кабинет пациента</Title>
                                <Text type="secondary">Пациент: </Text><strong>{user.name}</strong>
                                <span style={{ margin: '0 8px', color: '#bfbfbf' }}>|</span>
                                <Text type="secondary">Тел: </Text><strong>{user.phone}</strong>
                            </div>
                            <Button icon={<LogoutOutlined />} onClick={handleLogout} danger>
                                Выйти
                            </Button>
                        </div>
                    </Card>

                    <Title level={4} style={{ marginBottom: '16px' }}>История ваших записей на прием</Title>

                    {userBookings.length > 0 ? (
                        <Table
                            dataSource={userBookings}
                            columns={columns}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            scroll={{ x: true }}
                            style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        />
                    ) : (
                        <Card style={{ textAlign: 'center', padding: '40px 0', borderRadius: '12px' }}>
                            <Empty
                                description="У вас пока нет активных или прошлых записей в нашей системе."
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                            <Button type="primary" href="/" style={{ marginTop: '16px' }}>
                                Записаться на прием прямо сейчас
                            </Button>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}