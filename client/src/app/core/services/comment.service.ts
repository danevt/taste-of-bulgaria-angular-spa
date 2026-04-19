import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../../models/comment.model';
import { COMMENTS_BASE, RECIPES_BASE } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private options = { withCredentials: true };

  constructor(private http: HttpClient) {}

  getLatestComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(COMMENTS_BASE, this.options);
  }

  createComment(recipeId: string, commentText: string): Observable<Comment> {
    return this.http.post<Comment>(`${RECIPES_BASE}/${recipeId}`, { commentText }, this.options);
  }

  editComment(recipeId: string, commentId: string, commentText: string): Observable<Comment> {
    return this.http.put<Comment>(
      `${RECIPES_BASE}/${recipeId}/comments/${commentId}`,
      { commentText },
      this.options,
    );
  }

  deleteComment(recipeId: string, commentId: string): Observable<any> {
    return this.http.delete(`${RECIPES_BASE}/${recipeId}/comments/${commentId}`, this.options);
  }
}
