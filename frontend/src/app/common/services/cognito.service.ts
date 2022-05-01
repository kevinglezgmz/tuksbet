import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { User } from '../data-types/users';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  url: string = environment.serverUrl + '/api/cognito';

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  loginCognito(userData: { email: string; password: string }): Promise<any> {
    const loginUrl = this.url + '/login';
    return this.httpClient.post(loginUrl, userData).toPromise();
  }

  verifyAccountCognito(userData: { email: string; confirmationCode: string }): Promise<any> {
    const verifyUrl = this.url + '/verify';
    return this.httpClient.post(verifyUrl, userData).toPromise();
  }

  resendVerifyCodeCognito(email: string): Promise<any> {
    const verifyUrl = this.url + '/verify/resend';
    return this.httpClient.post(verifyUrl, { email }).toPromise();
  }

  logoutCognito(): Promise<any> {
    const logoutUrl = this.url + '/logout/token';
    const headers: HttpHeaders = this.authService.getAuthRefreshTokenHeader();
    return this.httpClient.get(logoutUrl, { headers }).toPromise();
  }

  loginCognitoRefresh(userId: string, provider: string) {
    const refreshUrl = this.url + '/login/token/refresh';
    const headers: HttpHeaders = this.authService.getAuthRefreshTokenHeader();
    return this.httpClient.post(refreshUrl, { userId, provider }, { headers }).toPromise();
  }

  createUserCognito(user: User): Promise<any> {
    const signupUrl = this.url + '/signup';
    return this.httpClient.post(signupUrl, user).toPromise();
  }

  updatePassword(actualPassword: string, newPassword: string): Promise<any> {
    const passwordChangeUrl = this.url + '/password/change';
    return this.httpClient.post(passwordChangeUrl, { oldPassword: actualPassword, newPassword }).toPromise();
  }
}
