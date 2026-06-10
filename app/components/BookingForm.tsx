'use client';

import React, { useEffect } from 'react';
import { Form, Input, Button, Select, Card, Typography, message } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { servicesData } from '../data/servicesData';
import { doctorsData } from '../data/doctorsData';
import { useSearchParams } from 'next/navigation';

const { Title, Paragraph } = Typography;

export default function BookingForm() {
    const [form] = Form.useForm();
    const searchParams = useSearchParams();

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
        const serviceParam = searchParams.get('service');
        const doctorParam = searchParams.get('doctor');

        const initialValues: { service: string; doctor: string } = {
            service: 'Обратный звонок',
            doctor: 'Не выбран (распределит оператор)',
        };

        if (serviceParam) {
            const foundService = serviceOptions.find(opt => opt.value === serviceParam);
            initialValues.service = foundService ? foundService.value : 'Обратный звонок';
        }

        if (doctorParam) {
            const foundDoctor = doctorOptions.find(opt => opt.value === doctorParam);
            initialValues.doctor = foundDoctor ? foundDoctor.value : 'Не выбран (распределит оператор)';
        }

        form.setFieldsValue(initialValues);
    }, [searchParams, form, serviceOptions, doctorOptions]);

    const onFinish = async (values: { name: string; phone: string; service: string; doctor: string }) => {
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: values.name,
                    phone: values.phone,
                    service: values.service,
                    doctor: values.doctor,
                }),
            });
            if (!res.ok) throw new Error('Ошибка сервера');
            message.success(`Заявка на "${values.service}" принята! Менеджер свяжется с вами в ближайшее время.`);
            form.resetFields();
            form.setFieldsValue({
                service: 'Обратный звонок',
                doctor: 'Не выбран (распределит оператор)',
            });
        } catch (error) {
            console.error('Ошибка при сохранении заявки:', error);
            message.error('Что-то пошло не так при сохранении заявки.');
        }
    };

    return (
        <div style={{ padding: '0 16px', width: '100%' }}>
            {/* Обертка гарантирует, что на мобилках карточка не прилипнет к краям экрана */}
            <Card
                // АДАПТИВНЫЙ ПАДДИНГ: На мобилках Ant Design автоматически уменьшит padding
                // внутри тела карточки, если не хардкодить rigid стили в styles.body
                style={{
                    maxWidth: '500px',
                    margin: '24px auto',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                }}
                variant="borderless"
            >
                <Title level={3} style={{ textAlign: 'center', marginBottom: '8px', fontSize: 'clamp(20px, 5vw, 24px)' }}>
                    {/* Крупные заголовки на маленьких телефонах могут переноситься некрасиво.
                        clamp() делает размер шрифта гибким: минимум 20px, максимум 24px */}
                    Онлайн-запись на прием
                </Title>

                <Paragraph style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px', fontSize: '14px', lineHeight: '1.6' }}>
                    Оставьте свои контактные данные и наш менеджер перезвонит вам в ближайшее время и запишет на прием к интересующему вас специалисту.
                </Paragraph>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    initialValues={{
                        service: 'Обратный звонок',
                        doctor: 'Не выбран (распределит оператор)',
                    }}
                >
                    <Form.Item name="name" label="Ваше имя" rules={[{ required: true, message: 'Пожалуйста, введите ваше имя' }]}>
                        <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="Иванов Иван Иванович" size="large" />
                    </Form.Item>

                    <Form.Item name="phone" label="Номер телефона" rules={[{ required: true, message: 'Пожалуйста, введите номер телефона' }]}>
                        <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} placeholder="+996 (XXX) XXX-XXX" size="large" />
                    </Form.Item>

                    <Form.Item name="service" label="Интересующая услуга">
                        <Select
                            placeholder="Выберите услугу"
                            size="large"
                            options={serviceOptions}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>

                    <Form.Item name="doctor" label="Предпочитаемый специалист">
                        <Select
                            placeholder="Выберите врача (необязательно)"
                            size="large"
                            options={doctorOptions}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" size="large" block style={{ borderRadius: '6px', fontWeight: 600 }}>
                            Отправить заявку
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}