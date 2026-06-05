'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Form, Input, Button, Select, Card, Typography, message, Row, Col, Rate } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import BookingForm from './components/BookingForm'; // ИСПРАВЛЕНО: Импортируем вынесенный компонент
import { doctorsData } from './data/doctorsData'; // ИСПРАВЛЕНО: Импортируем данные о врачах

const { Title, Paragraph } = Typography;
const { Option } = Select; // Все еще нужен для отзывов

interface IReview {
  id: string;
  author: string;
  doctorName: string;
  rating: number;
  content: string;
  date: string;
}

export default function HomePage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewDoctor, setReviewDoctor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');

  // ИСПРАВЛЕНО: Список врачей берется из doctorsData
  const doctorsList = doctorsData.map(doc => doc.name);

  useEffect(() => {
    const savedReviews = localStorage.getItem('med-reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      const defaultReviews: IReview[] = []; // Можно добавить несколько дефолтных отзывов для примера
      setReviews(defaultReviews);
      localStorage.setItem('med-reviews', JSON.stringify(defaultReviews));
    }
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
      <div style={{ padding: '60px 24px', background: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={1} style={{ color: '#1890ff' }}>Добро пожаловать в Мед-Центр</Title>
          <Paragraph style={{ fontSize: '16px', color: '#555', maxWidth: '600px', margin: '0 auto' }}>
            Запишитесь на консультацию или свяжитесь с нашей информационной службой онлайн.
          </Paragraph>
        </div>

        <Suspense fallback={null}>
          <BookingForm />
        </Suspense>

        <div style={{ maxWidth: '1000px', margin: '60px auto 0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
            Отзывы наших пациентов
          </Title>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={10}>
              <Card title="Оставить отзыв" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
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
                    <Input.TextArea rows={4} placeholder="Опишите ваши впечатления..." value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} />
                  </div>
                  <Button type="primary" block onClick={handleSubmitReview} style={{ marginTop: '6px', fontWeight: 500 }}>
                    Опубликовать отзыв
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={14}>
              <Card title={`Все отзывы (${reviews.length})`} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '430px', overflowY: 'auto', paddingRight: '8px' }}>
                  {reviews.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '40px 0', fontSize: '14px' }}>
                        Отзывов пока нет. Станьте первым!
                      </div>
                  ) : (
                      reviews.map((rev) => (
                          <div key={rev.id} style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <strong style={{ fontSize: '14px', color: '#1e293b' }}>{rev.author}</strong>
                              <span style={{ color: '#94a3b8', fontSize: '12px' }}>{rev.date}</span>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                              <span style={{ color: '#64748b', fontSize: '13px', display: 'block', marginBottom: '2px' }}>👨‍⚕️ Врач: {rev.doctorName}</span>
                              <Rate disabled defaultValue={rev.rating} style={{ fontSize: '13px' }} />
                            </div>
                            <p style={{ margin: 0, color: '#334155', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
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