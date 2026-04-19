import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private _errorMessage = signal<string | null>(null);

  errorMessage = this._errorMessage.asReadonly();

  setError(message: string) {
    this._errorMessage.set(message);
    setTimeout(() => this.clearError(), 5000);
  }

  clearError() {
    this._errorMessage.set(null);
  }
}
