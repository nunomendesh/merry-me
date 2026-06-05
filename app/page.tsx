'use client';

import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояние для полей формы
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  // Состояние для ошибок валидации
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
  });

  // Универсальная функция обновления полей (Принцип DRY)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Сбрасываем ошибку поля при вводе текста
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Функция сохранения записи
  const handleBookingSubmit = () => {
    // Простая ручная валидация, имитирующая схему Yup под ТЗ куратора
    let hasError = false;
    const newErrors = { name: '', phone: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Обязательное поле.';
      hasError = true;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Обязательное поле.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Если всё заполнено, создаем объект новой заявки
    const newAppointment = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      status: 'pending', // Статус для админки (новое)
      date: '', // Менеджер проставит при звонке
    };

    // Достаем старые записи из localStorage, добавляем новую и сохраняем обратно
    const existingAppointments = JSON.parse(localStorage.getItem('med-appointments') || '[]');
    existingAppointments.push(newAppointment);
    localStorage.setItem('med-appointments', JSON.stringify(existingAppointments));

    // Очищаем форму и закрываем модалку
    setFormData({ name: '', phone: '' });
    setIsModalOpen(false);
    alert('Заявка успешно отправлена! Наш менеджер свяжется с вами в ближайшее время.');
  };

  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
            Многопрофильный Медицинский Центр
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Качественное медицинское обслуживание в Бишкеке. Нажмите на кнопку ниже, чтобы записаться на прием к специалисту.
          </p>

          <Button
              type="primary"
              size="large"
              className="bg-blue-500 hover:bg-blue-600 h-12 px-8 rounded-full text-base font-semibold shadow-md"
              onClick={() => setIsModalOpen(true)}
          >
            Записаться на прием к врачу
          </Button>
        </div>

        {/* МОДАЛЬНОЕ ОКНО ЗАПИСИ (Стилизовано под medcenter.kg) */}
        <Modal
            title={null} // Скрываем стандартный заголовок, чтобы сделать кастомный
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null} // Скрываем стандартные кнопки OK/Cancel
            centered
            width={450}
        >
          <div className="text-center pt-4 pb-2">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Запишитесь на прием к врачу</h2>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">
              Оставьте свои контактные данные и наш менеджер перезвонит вам в ближайшее время и запишет на прием к интересующему вам врачу
            </p>
          </div>

          <div className="space-y-4">
            {/* Поле Имени */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Введите ваше Имя <span className="text-red-500">*</span>
              </label>
              <Input
                  name="name"
                  placeholder="Ваше Имя"
                  size="large"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`hover:border-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Поле Телефона */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Введите ваш телефон <span className="text-red-500">*</span>
              </label>
              <Input
                  name="phone"
                  placeholder="Ваш телефон"
                  size="large"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`hover:border-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
            </div>

            {/* Кнопка отправки */}
            <div className="text-center pt-4">
              <Button
                  type="primary"
                  size="large"
                  onClick={handleBookingSubmit}
                  className="bg-blue-500 hover:bg-blue-600 w-full md:w-auto px-10 h-11 rounded-full font-semibold"
              >
                Записаться к врачу
              </Button>
            </div>
          </div>
        </Modal>
      </main>
  );
}