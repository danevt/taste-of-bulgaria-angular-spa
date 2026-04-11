import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3030';
  private options = { withCredentials: true };

  constructor(private http: HttpClient) {}

  register(email: string, username: string, password: string): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/register`,
      { email, username, password },
      this.options,
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }, this.options);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, this.options);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/profile`, this.options);
  }
}
