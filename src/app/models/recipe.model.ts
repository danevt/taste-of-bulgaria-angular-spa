export interface Recipe {
  _id: string;
  name: string;
  category: 'Main Dishes' | 'Salads & Appetizers' | 'Desserts';
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
  userId: string;
  comments: string[];
  favorites: string[];
  created_at: string;
}
