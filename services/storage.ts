import { User, Book, BookFormData } from '../types';

const USERS_KEY = 'library_users';
const BOOKS_KEY = 'library_books';
const CURRENT_USER_KEY = 'library_current_user';

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const storageService = {
  // --- Auth Methods ---
  
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  login: async (username: string, password: string): Promise<User> => {
    await delay(500); // Simulate DB latency
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // In a real app, we would verify the hash using password_verify in PHP
    // Here we do a simple check for the mock
    const user = users.find(u => u.username === username && u.passwordHash === btoa(password));
    
    if (!user) {
      throw new Error('Неверное имя пользователя или пароль');
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  register: async (username: string, password: string): Promise<User> => {
    await delay(500);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

    if (users.some(u => u.username === username)) {
      throw new Error('Пользователь с таким именем уже существует');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      passwordHash: btoa(password), // Simple base64 as mock "hash"
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser)); // Auto login
    return newUser;
  },

  // --- Book CRUD Methods ---

  getBooks: async (userId: string): Promise<Book[]> => {
    await delay(300);
    const books: Book[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    // Filter by user ID (simulating WHERE user_id = ?)
    return books
      .filter(book => book.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  addBook: async (userId: string, data: BookFormData): Promise<Book> => {
    await delay(300);
    const books: Book[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    
    const newBook: Book = {
      id: crypto.randomUUID(),
      userId,
      ...data,
      createdAt: Date.now(),
    };

    books.push(newBook);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    return newBook;
  },

  updateBook: async (bookId: string, data: BookFormData): Promise<Book> => {
    await delay(300);
    const books: Book[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    const index = books.findIndex(b => b.id === bookId);

    if (index === -1) throw new Error('Книга не найдена');

    const updatedBook = { ...books[index], ...data };
    books[index] = updatedBook;
    
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    return updatedBook;
  },

  deleteBook: async (bookId: string): Promise<void> => {
    await delay(300);
    let books: Book[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    books = books.filter(b => b.id !== bookId);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  }
};