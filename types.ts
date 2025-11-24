export enum BookStatus {
  WANT_TO_READ = 'Хочу прочесть',
  READING = 'Читаю',
  READ = 'Прочитано',
}

export interface User {
  id: string;
  username: string;
  passwordHash: string; // Simulated hash
}

export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  status: BookStatus;
  review?: string;
  createdAt: number;
}

export type BookFormData = Omit<Book, 'id' | 'userId' | 'createdAt'>;