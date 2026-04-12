import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_LOGIN, AUTH_REGISTER, AUTH_LOGOUT, AUTH_PROFILE } from '../constants/api.constants';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {  
  private options = { withCredentials: true };

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(AUTH_LOGIN, { email, password }, this.options);
  }

  register(email: string, username: string, password: string): Observable<User> {
    return this.http.post<User>(AUTH_REGISTER, { email, username, password }, this.options);
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_LOGOUT, {}, this.options);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(AUTH_PROFILE, this.options);
  }
}