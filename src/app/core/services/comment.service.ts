import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../../models/comment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:3030';
  private options = { withCredentials: true };

  constructor(private http: HttpClient) {}

  getLatestComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments`);
  }

  createComment(recipeId: string, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/recipes/${recipeId}`, { text }, this.options);
  }

  deleteComment(recipeId: string, commentId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/recipes/${recipeId}/comments/${commentId}`,
      this.options,
    );
  }
}
