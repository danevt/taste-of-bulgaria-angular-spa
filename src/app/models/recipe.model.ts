export interface Recipe {
  _id: string;
  name: string;
  category: 'Main Dishes' | 'Salads & Appetizers' | 'Desserts';
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
  userId: string | { _id: string; username: string };
  comments: string[] | Comment[];
  favorites: string[];
  createdAt: string;
  updatedAt: string;
}
