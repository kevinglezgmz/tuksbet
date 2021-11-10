import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  deleteToken(): void {
    localStorage.removeItem('token');
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({ ['Authorization']: ['Bearer ' + this.getToken()] });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
