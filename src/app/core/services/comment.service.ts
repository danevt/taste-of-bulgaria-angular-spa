import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../../models/comment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:3030/data/comments';

  constructor(private http: HttpClient) {}

  getCommentsByRecipeId(recipeId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?where=recipeId%3D%22${recipeId}%22`);
  }

  addComment(text: string, recipeId: string) {
    return this.http.post<Comment>(this.apiUrl, { text, recipeId });
  }
}
