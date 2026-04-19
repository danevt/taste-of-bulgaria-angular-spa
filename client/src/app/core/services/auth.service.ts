import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AUTH_LOGIN, AUTH_REGISTER, AUTH_LOGOUT } from '../constants/api.constants';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<User | null>(null);
  private _isLoggedIn = signal<boolean>(false);

  public currentUser = this._currentUser.asReadonly();
  public isLoggedIn = this._isLoggedIn.asReadonly();

  private options = { withCredentials: true };

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this._currentUser.set(JSON.parse(saved));
      this._isLoggedIn.set(true);
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(AUTH_LOGIN, { email, password }, this.options)
      .pipe(tap((user) => this.setUser(user)));
  }

  register(email: string, username: string, password: string): Observable<User> {
    return this.http
      .post<User>(AUTH_REGISTER, { email, username, password }, this.options)
      .pipe(tap((user) => this.setUser(user)));
  }

  logout(): Observable<void> {
    return this.http.post<void>(AUTH_LOGOUT, {}, this.options).pipe(tap(() => this.clearUser()));
  }

  getCurrentUserId(): string | null {
    return this._currentUser()?._id || null;
  }

  private setUser(user: User): void {
    this._currentUser.set(user);
    this._isLoggedIn.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private clearUser(): void {
    this._currentUser.set(null);
    this._isLoggedIn.set(false);
    localStorage.removeItem('currentUser');
  }
}
