import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  url: string = environment.serverUrl + '/api/sessions';
  cognitoUrl = environment.serverUrl + '/api/users/cognito';

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  login(userData: { email: string; password: string }): Promise<any> {
    const loginUrl = this.url + '/login';
    return this.httpClient.post(loginUrl, userData).toPromise();
  }

  logout(): Promise<any> {
    const logoutUrl = this.url + '/logout';
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.httpClient.get(logoutUrl, { headers }).toPromise();
  }

  loginWithSocialNetwork(
    socialUser: SocialUser
  ): Promise<{ token: string; userId: string; username: string; roles: string }> {
    let token = '';
    switch (socialUser.provider) {
      case 'GOOGLE':
        token = socialUser.idToken;
        break;
      case 'FACEBOOK':
        token = socialUser.authToken;
        break;
    }
    const headers = new HttpHeaders({ ['Authorization']: ['Bearer ' + token] });
    return this.httpClient
      .post<{ token: string; userId: string; username: string; roles: string }>(
        this.url + '/login/' + socialUser.provider.toLowerCase(),
        { provider: socialUser.provider, socialUser },
        { headers }
      )
      .toPromise();
  }
}
