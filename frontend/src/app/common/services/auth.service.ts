import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loginStatus.next(!!this.getToken());
  }

  saveUserDetails(userDetails: { token: string; userId: string; username: string; roles: string }) {
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    this.loginStatus.next(true);
  }

  getUserDetails(): { username: string | undefined; userId: string | undefined; roles: string | undefined } {
    const { username, userId, roles } = JSON.parse(localStorage.getItem('userDetails') || '{}');
    return { username, userId, roles };
  }

  getToken(): string {
    const { token } = JSON.parse(localStorage.getItem('userDetails') || '{}');
    return token || '';
  }

  deleteUserDetails(): void {
    localStorage.removeItem('userDetails');
    this.loginStatus.next(false);
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({ ['Authorization']: ['Bearer ' + this.getToken()] });
  }

  isLoggedIn(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }
}
