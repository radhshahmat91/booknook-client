import type { Category } from "@/lib/utils";

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: Category;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt?: string;
};

export type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
};

export type BookInput = Pick<Book, "title" | "author" | "category" | "image" | "description" | "totalCopies">;
