export interface User {
  _id: string;
  email: string;
  username: string;
  recipes: string[];
  comments: string[];
  favorites: string[];
  created_at: string;
  accessToken?: string;
}
