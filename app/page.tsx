'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Card, Typography, message, Row, Col, Rate, Grid } from 'antd';
import BookingForm from './components/BookingForm';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

interface IReview {
  id: string;
  author: string;
  doctorName: string;
  rating: number;
  content: string;
  date: string;
}

interface IDoctor {
  id: string;
  name: string;
  specialty: string;
  specialtyLabel: string;
}

interface IClinicSettings {
  clinicName: string;
  tagline: string;
}

export default function HomePage() {
  const screens = useBreakpoint();
  const isMobile = screens.xs || (screens.sm && !screens.md);

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewDoctor, setReviewDoctor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');

  // Состояния для динамических данных с бэкенда
  const [doctorsList, setDoctorsList] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Дефолтные настройки на случай, если бэкенд не ответит сразу
  const [clinicSettings, setClinicSettings] = useState<IClinicSettings>({
    clinicName: 'Загрузка...',
    tagline: 'Получение информации о медицинском центре...'
  });

  useEffect(() => {
    // 1. Загрузка отзывов из localStorage
    const savedReviews = localStorage.getItem('med-reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      const defaultReviews: IReview[] = [];
      setReviews(defaultReviews);
      localStorage.setItem('med-reviews', JSON.stringify(defaultReviews));
    }

    // 2. Запрос к бэкенду за настройками и врачами
    fetch('/api/data.json')
        .then((res) => {
          if (!res.ok) throw new Error('Ошибка при загрузке конфигурации клиники');
          return res.json();
        })
        .then((data) => {
          // Загружаем настройки названия клиники и слогана
          if (data.settings) {
            setClinicSettings({
              clinicName: data.settings.clinicName || 'Мед-Центр',
              tagline: data.settings.tagline || ''
            });
          }

          // Вытаскиваем список врачей
          if (data.doctors) {
            const names = data.doctors.map((doc: IDoctor) => doc.name);
            setDoctorsList(names);
          }

          setLoadingData(false);
        })
        .catch((err) => {
          console.error('Ошибка бэкенда на главной странице:', err);
          message.error('Не удалось загрузить данные клиники');
          setLoadingData(false);
        });
  }, []);

  const handleSubmitReview = () => {
    if (!reviewAuthor.trim() || !reviewDoctor || !reviewContent.trim()) {
      message.error('Пожалуйста, заполните все поля формы и выберите специалиста!');
      return;
    }

    const newReview: IReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor,
      doctorName: reviewDoctor,
      rating: reviewRating,
      content: reviewContent,
      date: new Date().toLocaleDateString('ru-RU')
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('med-reviews', JSON.stringify(updatedReviews));

    setReviewAuthor('');
    setReviewDoctor('');
    setReviewRating(5);
    setReviewContent('');

    message.success('Спасибо за отзыв! Он успешно добавлен на сайт.');
  };

  return (
      <div style={{ padding: isMobile ? '24px 16px' : '60px 24px', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Приветственный блок берет данные из переменной clinicSettings */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
          <Title level={1} style={{ color: '#1890ff', fontSize: 'clamp(24px, 6vw, 38px)', marginBottom: '12px' }}>
            Добро пожаловать в {clinicSettings.clinicName}
          </Title>
          <Paragraph style={{ fontSize: isMobile ? '14px' : '16px', color: '#555', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
            {clinicSettings.tagline}
          </Paragraph>
        </div>

        {/* Форма онлайн-записи */}
        <BookingForm />

        {/* Блок отзывов */}
        <div style={{ maxWidth: '1000px', margin: isMobile ? '40px auto 0 auto' : '60px auto 0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: isMobile ? '20px' : '32px', fontSize: 'clamp(20px, 5vw, 28px)' }}>
            Отзывы наших пациентов
          </Title>

          <Row gutter={[24, 24]}>
            {/* Левая колонка: Форма отзыва */}
            <Col xs={24} md={10}>
              <Card title="Оставить отзыв" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} styles={{ body: { padding: isMobile ? '16px' : '24px' } }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: '#4b5563', fontSize: '14px' }}>Ваше имя:</label>
                    <Input placeholder="Имя или инициалы" value={reviewAuthor} onChange={(e) => setReviewAuthor(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: '#4b5563', fontSize: '14px' }}>Выберите врача:</label>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Кто был вашим врачом?"
                        value={reviewDoctor || undefined}
                        onChange={(value) => setReviewDoctor(value)}
                        loading={loadingData}
                        disabled={loadingData}
                    >
                      {doctorsList.map(doc => (
                          <Option key={doc} value={doc}>{doc}</Option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: '#4b5563', fontSize: '14px' }}>Ваша оценка:</label>
                    <Rate value={reviewRating} onChange={(val) => setReviewRating(val)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: '#4b5563', fontSize: '14px' }}>Текст отзыва:</label>
                    <Input.TextArea rows={isMobile ? 3 : 4} placeholder="Опишите ваши впечатления..." value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} />
                  </div>
                  <Button type="primary" block onClick={handleSubmitReview} style={{ marginTop: '6px', fontWeight: 500, height: '40px' }}>
                    Опубликовать отзыв
                  </Button>
                </div>
              </Card>
            </Col>

            {/* Правая колонка: Лента отзывов */}
            <Col xs={24} md={14}>
              <Card title={`Все отзывы (${reviews.length})`} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} styles={{ body: { padding: isMobile ? '16px' : '24px' } }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: isMobile ? '350px' : '430px', overflowY: 'auto', paddingRight: '4px' }}>
                  {reviews.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '40px 0', fontSize: '14px' }}>
                        Отзывов пока нет. Станьте первым!
                      </div>
                  ) : (
                      reviews.map((rev) => (
                          <div key={rev.id} style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', gap: '8px' }}>
                              <strong style={{ fontSize: '14px', color: '#1e293b', wordBreak: 'break-word' }}>{rev.author}</strong>
                              <span style={{ color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>{rev.date}</span>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                              <span style={{ color: '#64748b', fontSize: '13px', display: 'block', marginBottom: '2px' }}>👨‍⚕️ Врач: {rev.doctorName}</span>
                              <Rate disabled defaultValue={rev.rating} style={{ fontSize: '12px' }} />
                            </div>
                            <p style={{ margin: 0, color: '#334155', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                              {rev.content}
                            </p>
                          </div>
                      ))
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
  );
}