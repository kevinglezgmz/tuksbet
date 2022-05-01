import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loginSocialStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loginExpiryTime: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  constructor() {
    const token = this.getToken();
    const tokenValidityTime = this.getRemainingTokenValidTimeInMs();

    const provider = this.getUserDetails().provider;

    if (!provider) {
      this.loginSocialStatus.next(false);
    }
    if (!token) {
      this.loginStatus.next(false);
    } else {
      this.loginStatus.next(true);
      if (provider) {
        this.loginSocialStatus.next(true);
      }
      this.loginExpiryTime.next(tokenValidityTime);
    }
  }

  saveUserDetails(userDetails: {
    token: string;
    refreshToken: string;
    expiresIn: number;
    issuedAt: number;
    userId: string;
    username: string;
    roles: string;
    provider?: string | null;
  }) {
    if (!userDetails.provider) {
      delete userDetails.provider;
    }
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    this.loginStatus.next(true);
    if (userDetails.provider) {
      this.loginSocialStatus.next(true);
    }
    const tokenValidityTime = this.getRemainingTokenValidTimeInMs();
    this.loginExpiryTime.next(tokenValidityTime);
  }

  getUserDetails(): {
    username: string | undefined;
    userId: string | undefined;
    roles: string | undefined;
    provider: string | undefined;
  } {
    const { username, userId, roles, provider } = JSON.parse(localStorage.getItem('userDetails') || '{}');
    return { username, userId, roles, provider };
  }

  getToken(): string {
    const { token } = JSON.parse(localStorage.getItem('userDetails') || '{}');
    return token || '';
  }

  getRefreshToken(): string {
    const { refreshToken } = JSON.parse(localStorage.getItem('userDetails') || '{}');
    return refreshToken || '';
  }

  getRemainingTokenValidTimeInMs(): number {
    const { issuedAt } = JSON.parse(localStorage.getItem('userDetails') || '{}');
    const { expiresIn } = JSON.parse(localStorage.getItem('userDetails') || '{}');
    let difference = -1;
    if (issuedAt && expiresIn) {
      difference = parseInt(issuedAt) + parseInt(expiresIn) - Date.now();
    }
    return difference;
  }

  deleteUserDetails(): void {
    localStorage.removeItem('userDetails');
    this.loginStatus.next(false);
    this.loginSocialStatus.next(false);
    this.loginExpiryTime.next(-1);
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({
      ['Authorization']: ['Bearer ' + this.getToken()],
      ['UserId']: this.getUserDetails().userId || '',
    });
  }

  getAuthRefreshTokenHeader(): HttpHeaders {
    return new HttpHeaders({
      ['Authorization']: ['Bearer ' + this.getRefreshToken()],
      ['UserId']: this.getUserDetails().userId || '',
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  isSocialLogin(): Observable<boolean> {
    return this.loginSocialStatus.asObservable();
  }

  loginExpiryObservable(): Observable<number> {
    return this.loginExpiryTime.asObservable();
  }
}
