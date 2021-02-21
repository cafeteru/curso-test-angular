export interface Book {
  id?: string;
  name: string;
  author: string;
  isbn: string;
  description?: string;
  photoUrl?: string;
  price?: number;
  amount?: number;
}
