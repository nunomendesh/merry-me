'use client';

import React, { useEffect, useState } from 'react';
import { Table, Checkbox, Button, Modal, DatePicker, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

// Описываем тип данных для TypeScript
interface Appointment {
    id: number;
    name: string;
    phone: string;
    status: 'pending' | 'called' | 'scheduled';
    date?: string;
}

export default function AdminPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');

    // Загружаем заявки из localStorage при открытии страницы (Принцип DRY / Синхронизация)
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('med-appointments') || '[]');
        setAppointments(data);
    }, []);

    // Сохранение обновленного списка в localStorage
    const saveToStorage = (updatedList: Appointment[]) => {
        setAppointments(updatedList);
        localStorage.setItem('med-appointments', JSON.stringify(updatedList));
    };

    // Переключение чекбокса звонка (Статус: позвонили / не позвонили)
    const handleCallCheckbox = (id: number, checked: boolean) => {
        const updated = appointments.map((app) => {
            if (app.id === id) {
                return { ...app, status: checked ? 'called' : 'pending' } as Appointment;
            }
            return app;
        });
        saveToStorage(updated);
    };

    // Открытие модалки для выбора даты (Переход на календарь/лист приёмов)
    const openScheduleModal = (id: number) => {
        setSelectedAppId(id);
        setIsModalOpen(true);
    };

    // Подтверждение даты приема менеджером
    const handleConfirmSchedule = () => {
        if (!selectedAppId || !selectedDate) return;

        const updated = appointments.map((app) => {
            if (app.id === selectedAppId) {
                return { ...app, status: 'scheduled', date: selectedDate } as Appointment;
            }
            return app;
        });

        saveToStorage(updated);
        setIsModalOpen(false);
        setSelectedDate('');
        setSelectedAppId(null);
    };

    // Определение колонок для таблицы Antd
    const columns: ColumnsType<Appointment> = [
        {
            title: 'Имя Пациента',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="font-medium text-gray-800">{text}</span>,
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Статус звонка',
            key: 'status_call',
            render: (_, record) => (
                <Checkbox
                    checked={record.status === 'called' || record.status === 'scheduled'}
                    disabled={record.status === 'scheduled'}
                    onChange={(e) => handleCallCheckbox(record.id, e.target.checked)}
                >
                    Звонок совершен
                </Checkbox>
            ),
        },
        {
            title: 'Статус записи',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                if (status === 'scheduled') return <Tag color="success">Утверждено</Tag>;
                if (status === 'called') return <Tag color="processing">Ожидает дату</Tag>;
                return <Tag color="warning">Новая заявка</Tag>;
            },
        },
        {
            title: 'Дата приёма',
            dataIndex: 'date',
            key: 'date',
            render: (date, record) => (
                date ? (
                    <span className="font-semibold text-blue-600">{date}</span>
                ) : (
                    <Button
                        type="dashed"
                        size="small"
                        disabled={record.status === 'pending'}
                        onClick={() => openScheduleModal(record.id)}
                    >
                        Назначить дату
                    </Button>
                )
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Панель Управления Заявками</h1>
                        <p className="text-sm text-gray-500">Система контроля записей для менеджеров клиники</p>
                    </div>
                    <Button type="primary" href="/" className="bg-blue-500">На главную сайта</Button>
                </div>

                {/* Таблица заявок Ant Design */}
                <Table
                    columns={columns}
                    dataSource={appointments}
                    rowKey="id"
                    locale={{ emptyText: 'Новых заявок пока нет' }}
                />
            </div>

            {/* Модалка выбора даты приёма */}
            <Modal
                title="Выберите дату и время приёма врача"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleConfirmSchedule}
                okText="Утвердить запись"
                cancelText="Отмена"
                okButtonProps={{ className: 'bg-blue-500' }}
            >
                <div className="py-4">
                    <p className="mb-2 text-gray-600">Согласуйте дату с пациентом и выберите её ниже:</p>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        className="w-full"
                        onChange={(date, dateString) => {
                            if (dateString) setSelectedDate(Array.isArray(dateString) ? dateString[0] : dateString);
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
}