import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  saveUserDetails(userDetails: { token: string; userId: string; username: string }) {
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
  }

  getUserDetails(): { username: string | undefined; userId: string | undefined } {
    const { username, userId } = JSON.parse(localStorage.getItem('userDetails') || '');
    return { username, userId };
  }

  getToken(): string {
    const { token } = JSON.parse(localStorage.getItem('userDetails') || '');
    return token || '';
  }

  deleteToken(): void {
    localStorage.removeItem('userDetails');
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({ ['Authorization']: ['Bearer ' + this.getToken()] });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
