import React from 'react';
import { Book, BookStatus } from '../types';
import { Button } from './Button';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const getStatusColor = (status: BookStatus) => {
    switch (status) {
      case BookStatus.READ:
        return 'bg-green-100 text-green-800';
      case BookStatus.READING:
        return 'bg-blue-100 text-blue-800';
      case BookStatus.WANT_TO_READ:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2" title={book.title}>
            {book.title}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(book.status)}`}>
            {book.status}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1 mb-4">{book.author}</p>
        
        {book.review && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-100">
            <p className="text-sm text-gray-700 italic whitespace-pre-wrap line-clamp-4">
              "{book.review}"
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end space-x-2">
        <Button 
          variant="ghost" 
          onClick={() => onEdit(book)} 
          className="!p-1.5 text-gray-500 hover:text-indigo-600"
          title="Редактировать"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => onDelete(book.id)} 
          className="!p-1.5 text-gray-500 hover:text-red-600"
          title="Удалить"
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};