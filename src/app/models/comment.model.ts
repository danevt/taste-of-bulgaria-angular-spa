export interface Comment {
  _id: string;
  text: string;
  userId: string | { _id: string; username: string; email: string };
  recipeId: string;
  likes: string[];
  createdAt: string;
}
