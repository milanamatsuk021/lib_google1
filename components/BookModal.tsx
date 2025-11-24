import React, { useState, useEffect } from 'react';
import { Book, BookFormData, BookStatus } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormData) => Promise<void>;
  initialData?: Book;
  title: string;
}

export const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    status: BookStatus.WANT_TO_READ,
    review: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          author: initialData.author,
          status: initialData.status,
          review: initialData.review || '',
        });
      } else {
        setFormData({
          title: '',
          author: '',
          status: BookStatus.WANT_TO_READ,
          review: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Введите название книги';
    if (!formData.author.trim()) newErrors.author = 'Введите автора книги';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{title}</h3>
              <div className="space-y-4">
                <Input
                  label="Название"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  error={errors.title}
                />
                <Input
                  label="Автор"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  error={errors.author}
                />
                <Select
                  label="Статус"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as BookStatus })}
                  options={[
                    { value: BookStatus.WANT_TO_READ, label: BookStatus.WANT_TO_READ },
                    { value: BookStatus.READING, label: BookStatus.READING },
                    { value: BookStatus.READ, label: BookStatus.READ },
                  ]}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Отзыв (необязательно)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    rows={4}
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    placeholder="Мои впечатления о книге..."
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button type="submit" isLoading={loading} className="w-full sm:w-auto sm:ml-3">
                Сохранить
              </Button>
              <Button type="button" variant="secondary" onClick={onClose} className="mt-3 w-full sm:w-auto sm:mt-0">
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};