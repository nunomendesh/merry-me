'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Table, Tag, Card, Row, Col, Statistic, Select, Button, Typography, message, Input, DatePicker, Space, Modal, Form, Grid, Flex } from 'antd';
import {
    CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined, GoogleOutlined,
    GithubOutlined, LogoutOutlined, MedicineBoxOutlined, SearchOutlined, DeleteOutlined, PlusOutlined,
    FilterOutlined, PhoneOutlined, EditOutlined
} from '@ant-design/icons';
import { servicesData } from '../data/servicesData';
import { doctorsData } from '../data/doctorsData';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid; // Хук для определения размера экрана

interface IBookingRequest {
    id: string;
    name: string;
    phone: string;
    service: string;
    doctor?: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: string;
}

export default function AdminPage() {
    const screens = useBreakpoint(); // Получаем текущие брейкпоинты (md, sm, xs и т.д.)
    const isMobile = screens.xs || (screens.sm && !screens.md); // Флаг: экран мобильный (меньше 768px)

    const [bookings, setBookings] = useState<IBookingRequest[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userSession, setUserSession] = useState<{ name: string; provider: string } | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<IBookingRequest['status'] | 'all'>('all');
    const [filterDoctor, setFilterDoctor] = useState<string | 'all'>('all');
    const [filterService, setFilterService] = useState<string | 'all'>('all');
    const [filterDateRange, setFilterDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

    const [isAddBookingModalVisible, setIsAddBookingModalVisible] = useState(false);
    const [addBookingForm] = Form.useForm();

    const serviceOptions = [{ value: 'Обратный звонок', label: '📞 Обратный звонок' }].concat(
        servicesData.flatMap(category =>
            category.services.map(service => ({
                value: service.name,
                label: service.name,
            }))
        )
    );

    const doctorOptions = [{ value: 'Не выбран (распределит оператор)', label: '💼 Распределить позже' }].concat(
        doctorsData.map(doctor => ({
            value: doctor.name,
            label: `${doctor.name} (${doctor.specialtyLabel})`
        }))
    );

    useEffect(() => {
        const session = localStorage.getItem('med-admin-session');
        if (session) {
            setIsAuthenticated(true);
            setUserSession(JSON.parse(session));
        }
        loadBookings();
    }, []);

    const loadBookings = () => {
        const storedData = localStorage.getItem('med-bookings');
        if (storedData) {
            try {
                const parsedData: IBookingRequest[] = JSON.parse(storedData);
                parsedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setBookings(parsedData);
            } catch (e) {
                console.error('Ошибка парсинга данных из localStorage', e);
                message.error('Ошибка загрузки данных. Пожалуйста, попробуйте еще раз.');
            }
        }
    };

    const handleLogin = (provider: 'Google' | 'GitHub') => {
        setLoadingAuth(true);
        message.loading({ content: `Подключение к сервису ${provider}...`, key: 'auth' });

        setTimeout(() => {
            const mockUser = {
                name: provider === 'Google' ? 'Администратор Google' : 'Разработчик GitHub',
                provider: provider
            };
            localStorage.setItem('med-admin-session', JSON.stringify(mockUser));
            setIsAuthenticated(true);
            setUserSession(mockUser);
            setLoadingAuth(false);
            message.success({ content: `Вы успешно вошли через ${provider}!`, key: 'auth', duration: 2 });
        }, 1200);
    };

    const handleLogout = () => {
        localStorage.removeItem('med-admin-session');
        setIsAuthenticated(false);
        setUserSession(null);
        message.info('Вы вышли из панели управления.');
    };

    const updateBookingField = (id: string, field: keyof IBookingRequest, value: any) => {
        const updatedBookings = bookings.map((booking) => {
            if (booking.id === id) {
                return { ...booking, [field]: value };
            }
            return booking;
        });
        setBookings(updatedBookings);
        localStorage.setItem('med-bookings', JSON.stringify(updatedBookings));

        const fieldName = {
            name: 'Имя пациента', phone: 'Телефон', service: 'Услуга',
            doctor: 'Врач', date: 'Дата', time: 'Время', status: 'Статус', id: '1', createdAt: new Date(),
        }[field] || String(field);
        message.success(`${fieldName} успешно обновлено!`, 1.5);
    };

    const handleStatusChange = (id: string, newStatus: IBookingRequest['status']) => {
        updateBookingField(id, 'status', newStatus);
    };

    const handleDeleteBooking = (id: string) => {
        Modal.confirm({
            title: 'Вы уверены, что хотите удалить эту запись?',
            content: 'Это действие нельзя будет отменить. Запись будет навсегда удалена.',
            okText: 'Да, удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk() {
                const updatedBookings = bookings.filter(booking => booking.id !== id);
                setBookings(updatedBookings);
                localStorage.setItem('med-bookings', JSON.stringify(updatedBookings));
                message.success('Запись успешно удалена!');
            },
        });
    };

    const handleAddBooking = async () => {
        try {
            const values = await addBookingForm.validateFields();
            const formattedDate = values.date instanceof dayjs ? values.date.format('YYYY-MM-DD') : 'Связь по телефону';
            const formattedTime = values.time instanceof dayjs ? values.time.format('HH:mm') : 'В ближайшее время';

            const newBooking: IBookingRequest = {
                id: `admin-book-${Date.now()}`,
                name: values.name,
                phone: values.phone,
                service: values.service,
                doctor: values.doctor || 'Не выбран (распределит оператор)',
                date: formattedDate,
                time: formattedTime,
                status: 'pending',
                createdAt: new Date().toISOString(),
            };

            const updatedBookings = [newBooking, ...bookings];
            setBookings(updatedBookings);
            localStorage.setItem('med-bookings', JSON.stringify(updatedBookings));

            message.success('Новая запись успешно добавлена!');
            setIsAddBookingModalVisible(false);
            addBookingForm.resetFields();
        } catch (error) {
            message.error('Ошибка при добавлении новой записи. Пожалуйста, проверьте все поля.');
            console.error('Failed to add booking:', error);
        }
    };

    const filteredAndSearchedBookings = useMemo(() => {
        let currentBookings = [...bookings];

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentBookings = currentBookings.filter(booking =>
                booking.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                booking.phone.includes(lowerCaseSearchTerm)
            );
        }

        if (filterStatus !== 'all') {
            currentBookings = currentBookings.filter(booking => booking.status === filterStatus);
        }

        if (filterDoctor !== 'all') {
            currentBookings = currentBookings.filter(booking => booking.doctor === filterDoctor);
        }

        if (filterService !== 'all') {
            currentBookings = currentBookings.filter(booking => booking.service === filterService);
        }

        if (filterDateRange && filterDateRange[0] && filterDateRange[1]) {
            const startDate = filterDateRange[0].startOf('day');
            const endDate = filterDateRange[1].endOf('day');
            currentBookings = currentBookings.filter(booking => {
                if (booking.date === 'Связь по телефону') return true;
                const bookingDate = dayjs(booking.date);
                return (
                    bookingDate.isSame(startDate, 'day') ||
                    bookingDate.isSame(endDate, 'day') ||
                    (bookingDate.isAfter(startDate, 'day') && bookingDate.isBefore(endDate, 'day'))
                );
            });
        }

        return currentBookings;
    }, [bookings, searchTerm, filterStatus, filterDoctor, filterService, filterDateRange]);

    if (!isAuthenticated) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '16px' }}>
                <Card style={{ maxWidth: '420px', width: '100%', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', textAlign: 'center' }} styles={{ body: { padding: '40px 24px' } }}>
                    <MedicineBoxOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                    <Title level={3} style={{ marginBottom: '8px' }}>Вход в Мед-Админ</Title>
                    <Paragraph style={{ color: '#64748b', marginBottom: '32px' }}>
                        Для доступа к панели управления записями клиники, пожалуйста, авторизуйтесь через корпоративный аккаунт.
                    </Paragraph>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button type="default" size="large" icon={<GoogleOutlined style={{ color: '#ea4335' }} />} block disabled={loadingAuth} onClick={() => handleLogin('Google')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontWeight: 500 }}>
                            Войти через Google
                        </Button>
                        <Button type="default" size="large" icon={<GithubOutlined />} block disabled={loadingAuth} onClick={() => handleLogin('GitHub')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontWeight: 500, background: '#171515', color: '#fff' }}>
                            Войти через GitHub
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const totalBookings = filteredAndSearchedBookings.length;
    const pendingBookings = filteredAndSearchedBookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = filteredAndSearchedBookings.filter(b => b.status === 'confirmed').length;

    const renderStatusTag = (status: IBookingRequest['status']) => {
        let color = 'gold';
        let text = 'Ожидает';
        if (status === 'confirmed') { color = 'green'; text = 'Подтвержден'; }
        if (status === 'cancelled') { color = 'volcano'; text = 'Отменен'; }
        if (status === 'completed') { color = 'blue'; text = 'Завершен'; }
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
    };

    const columns = [
        {
            title: 'Пациент',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: IBookingRequest) => (
                <Input value={text} onChange={(e) => updateBookingField(record.id, 'name', e.target.value)} style={{ minWidth: '120px' }} />
            ),
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            key: 'phone',
            render: (text: string, record: IBookingRequest) => (
                <Input value={text} onChange={(e) => updateBookingField(record.id, 'phone', e.target.value)} style={{ minWidth: '120px' }} />
            ),
        },
        {
            title: 'Услуга / Направление',
            dataIndex: 'service',
            key: 'service',
            render: (service: string, record: IBookingRequest) => (
                <Select value={service} style={{ width: 210 }} onChange={(val) => updateBookingField(record.id, 'service', val)} options={serviceOptions} />
            )
        },
        {
            title: 'Назначенный Врач',
            dataIndex: 'doctor',
            key: 'doctor',
            render: (doctor: string | undefined, record: IBookingRequest) => (
                <Select value={doctor || 'Не выбран (распределит оператор)'} style={{ width: 210 }} onChange={(val) => updateBookingField(record.id, 'doctor', val)} options={doctorOptions} />
            )
        },
        {
            title: 'Дата и Время визита',
            key: 'dateTime',
            render: (_: any, record: IBookingRequest) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '140px' }}>
                    <Input type="date" size="small" value={record.date === 'Связь по телефону' ? '' : record.date} onChange={(e) => updateBookingField(record.id, 'date', e.target.value || 'Связь по телефону')} />
                    <Input type="time" size="small" value={record.time === 'В ближайшее время' ? '' : record.time} onChange={(e) => updateBookingField(record.id, 'time', e.target.value || 'В ближайшее время')} />
                </div>
            ),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: renderStatusTag,
        },
        {
            title: 'Создано',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => <span>{dayjs(createdAt).format('DD.MM.YYYY HH:mm')}</span>,
            sorter: (a: IBookingRequest, b: IBookingRequest) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            defaultSortOrder: 'descend' as const,
            width: 160,
        },
        {
            title: 'Действия',
            key: 'action',
            render: (_: any, record: IBookingRequest) => (
                <Space>
                    <Select value={record.status} style={{ width: 130 }} onChange={(value: IBookingRequest['status']) => handleStatusChange(record.id, value)}
                            options={[
                                { value: 'pending', label: 'Ожидает' },
                                { value: 'confirmed', label: 'Подтвердить' },
                                { value: 'completed', label: 'Завершить' },
                                { value: 'cancelled', label: 'Отменить' },
                            ]}
                    />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteBooking(record.id)} title="Удалить запись" />
                </Space>
            ),
            width: 180,
        },
    ];

    return (
        <div style={{ padding: isMobile ? '12px' : '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            {/* Хедер панели */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
                        Панель администратора клиники
                    </Title>
                    {userSession && (
                        <span style={{ color: '#8c8c8c', fontSize: '14px' }}>
                            Сессия: <strong>{userSession.name}</strong>
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
                    <Button type="default" onClick={loadBookings} icon={<SearchOutlined />} style={{ flex: isMobile ? 1 : 'none' }}>
                        {isMobile ? 'Обновить' : 'Обновить данные'}
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddBookingModalVisible(true)} style={{ flex: isMobile ? 1 : 'none' }}>
                        Добавить
                    </Button>
                    <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout} />
                </div>
            </div>

            {/* Карточки статистики */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Card styles={{ body: { padding: '20px' } }} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <Statistic title="Всего заявок" value={totalBookings} prefix={<UserOutlined style={{ color: '#1890ff' }} />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card styles={{ body: { padding: '20px' } }} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <Statistic title="Ожидают" value={pendingBookings} prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card styles={{ body: { padding: '20px' } }} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <Statistic title="Подтверждены" value={confirmedBookings} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} />
                    </Card>
                </Col>
            </Row>

            {/* Блок фильтров */}
            <Card style={{ marginBottom: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <Title level={5} style={{ marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FilterOutlined /> Фильтрация и поиск
                </Title>
                <Flex wrap="wrap" gap="middle" style={{ width: '100%' }} vertical={isMobile}>
                    <Input.Search
                        placeholder="Поиск по ФИО или телефону"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: isMobile ? '100%' : 250 }}
                    />
                    <Select placeholder="Фильтр по статусу" allowClear style={{ width: isMobile ? '100%' : 180 }} onChange={(value) => setFilterStatus(value || 'all')}
                            options={[
                                { value: 'all', label: 'Все статусы' },
                                { value: 'pending', label: 'Ожидает' },
                                { value: 'confirmed', label: 'Подтвержден' },
                                { value: 'completed', label: 'Завершен' },
                                { value: 'cancelled', label: 'Отменен' },
                            ]}
                            value={filterStatus}
                    />
                    <Select placeholder="Фильтр по врачу" allowClear style={{ width: isMobile ? '100%' : 220 }} onChange={(value) => setFilterDoctor(value || 'all')} options={[{ value: 'all', label: 'Все врачи' }].concat(doctorOptions)} value={filterDoctor} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
                    <Select placeholder="Фильтр по услуге" allowClear style={{ width: isMobile ? '100%' : 220 }} onChange={(value) => setFilterService(value || 'all')} options={[{ value: 'all', label: 'Все услуги' }].concat(serviceOptions)} value={filterService} showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
                    <RangePicker placeholder={['Дата от', 'Дата до']} onChange={(dates) => setFilterDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])} value={filterDateRange} format="DD.MM.YYYY" style={{ width: isMobile ? '100%' : 'auto' }} />
                    <Button block={isMobile} onClick={() => {
                        setSearchTerm(''); setFilterStatus('all'); setFilterDoctor('all'); setFilterService('all'); setFilterDateRange(null);
                        message.info('Все фильтры сброшены.');
                    }}>
                        Сбросить фильтры
                    </Button>
                </Flex>
            </Card>

            {/* Основной контент: ДЕСКТОП (Таблица) или МОБИЛКА (Карточки) */}
            {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredAndSearchedBookings.length === 0 ? (
                        <Card style={{ textAlign: 'center', color: '#8c8c8c' }}>Новых заявок пока нет</Card>
                    ) : (
                        filteredAndSearchedBookings.map((record) => (
                            <Card
                                key={record.id}
                                size="small"
                                style={{ borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}
                                title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '6px' }}><Text strong>{record.name || 'Без имени'}</Text>{renderStatusTag(record.status)}</div>}
                            >
                                <Space direction="vertical" style={{ width: '100%', marginBottom: '12px' }} size={4}>
                                    <div><Text type="secondary">Телефон: </Text><Text copyable>{record.phone}</Text></div>
                                    <div><Text type="secondary">Услуга: </Text><Text>{record.service}</Text></div>
                                    <div><Text type="secondary">Врач: </Text><Text>{record.doctor || 'Не назначен'}</Text></div>
                                    <div><Text type="secondary">Визит: </Text><Tag color="blue">{record.date} в {record.time}</Tag></div>
                                    <div><Text type="secondary" style={{ fontSize: '11px' }}>Создано: {dayjs(record.createdAt).format('DD.MM.YYYY HH:mm')}</Text></div>
                                </Space>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f0f0f0' }}>
                                    <Select
                                        value={record.status}
                                        style={{ width: '140px' }}
                                        onChange={(value: IBookingRequest['status']) => handleStatusChange(record.id, value)}
                                        options={[
                                            { value: 'pending', label: 'Ожидает' },
                                            { value: 'confirmed', label: 'Подтвердить' },
                                            { value: 'completed', label: 'Завершить' },
                                            { value: 'cancelled', label: 'Отменить' },
                                        ]}
                                    />
                                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteBooking(record.id)} />
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            ) : (
                <Card title="Свежие онлайн-записи пациентов" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <Table
                        columns={columns}
                        dataSource={filteredAndSearchedBookings}
                        rowKey="id"
                        locale={{ emptyText: 'Новых заявок пока нет' }}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: true }}
                    />
                </Card>
            )}

            {/* Модальное окно добавления записи */}
            <Modal
                title="Добавить новую запись"
                open={isAddBookingModalVisible}
                onCancel={() => { setIsAddBookingModalVisible(false); addBookingForm.resetFields(); }}
                onOk={handleAddBooking}
                okText="Добавить запись"
                cancelText="Отмена"
                confirmLoading={loadingAuth}
                width={isMobile ? '95%' : 520}
                style={{ top: isMobile ? 20 : 100 }}
            >
                <Form form={addBookingForm} layout="vertical" name="addBookingForm" initialValues={{ service: 'Обратный звонок', doctor: 'Не выбран (распределит оператор)' }}>
                    <Form.Item name="name" label="Имя пациента" rules={[{ required: true, message: 'Пожалуйста, введите имя пациента' }]}>
                        <Input prefix={<UserOutlined />} placeholder="ФИО пациента" />
                    </Form.Item>
                    <Form.Item name="phone" label="Телефон пациента" rules={[{ required: true, message: 'Пожалуйста, введите телефон пациента' }]}>
                        <Input prefix={<PhoneOutlined />} placeholder="+996 (XXX) XXX-XXX" />
                    </Form.Item>
                    <Form.Item name="service" label="Услуга/Направление" rules={[{ required: true, message: 'Пожалуйста, выберите услугу' }]}>
                        <Select options={serviceOptions} placeholder="Выберите услугу" showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
                    </Form.Item>
                    <Form.Item name="doctor" label="Назначенный врач">
                        <Select options={doctorOptions} placeholder="Выберите врача" showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="date" label="Дата визита">
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Дата визита" />
                            </Form.Item>
                        </Col>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="time" label="Время визита">
                                <DatePicker picker="time" format="HH:mm" style={{ width: '100%' }} placeholder="Время визита" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}