import React, { useEffect, useState, useCallback } from 'react';
import { User, Book, BookFormData, BookStatus } from '../types';
import { storageService } from '../services/storage';
import { BookCard } from '../components/BookCard';
import { BookModal } from '../components/BookModal';
import { Button } from '../components/Button';
import { PlusIcon, ArrowRightOnRectangleIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

type FilterType = BookStatus | 'ALL';

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    try {
      const data = await storageService.getBooks(user.id);
      setBooks(data);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleCreateBook = async (data: BookFormData) => {
    await storageService.addBook(user.id, data);
    await loadBooks();
    setFilter('ALL'); // Reset filter to show the new book
  };

  const handleUpdateBook = async (data: BookFormData) => {
    if (editingBook) {
      await storageService.updateBook(editingBook.id, data);
      await loadBooks();
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      await storageService.deleteBook(id);
      await loadBooks();
    }
  };

  const openCreateModal = () => {
    setEditingBook(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const filteredBooks = books.filter((book) => {
    if (filter === 'ALL') return true;
    return book.status === filter;
  });

  const filterOptions: { label: string; value: FilterType }[] = [
    { label: 'Все книги', value: 'ALL' },
    { label: BookStatus.WANT_TO_READ, value: BookStatus.WANT_TO_READ },
    { label: BookStatus.READING, value: BookStatus.READING },
    { label: BookStatus.READ, value: BookStatus.READ },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">Библиотека</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm hidden sm:block">
                Привет, <strong>{user.username}</strong>
              </span>
              <Button variant="ghost" onClick={onLogout} title="Выйти">
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Мои книги</h1>
          <Button onClick={openCreateModal} className="flex items-center w-full sm:w-auto justify-center">
            <PlusIcon className="h-5 w-5 mr-1" />
            Добавить книгу
          </Button>
        </div>

        {/* Filter Tabs */}
        {books.length > 0 && (
          <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex space-x-2 min-w-max">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border ${
                    filter === option.value
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                  {option.value !== 'ALL' && (
                    <span className={`ml-2 text-xs ${filter === option.value ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {books.filter(b => b.status === option.value).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
              <PlusIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Книг пока нет</h3>
            <p className="mt-1 text-sm text-gray-500 mb-6">Начните составлять свою библиотеку прямо сейчас.</p>
            <Button onClick={openCreateModal} variant="secondary">
              Добавить первую книгу
            </Button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <FunnelIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Ничего не найдено</h3>
            <p className="mt-1 text-sm text-gray-500 mb-6">В этой категории пока нет книг.</p>
            <Button onClick={() => setFilter('ALL')} variant="secondary">
              Показать все книги
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={openEditModal}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}
      </main>

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
        initialData={editingBook}
        title={editingBook ? 'Редактировать книгу' : 'Добавить книгу'}
      />
    </div>
  );
};