import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CognitoService } from './cognito.service';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenService {
  constructor(private authService: AuthService, private router: Router, private cognitoService: CognitoService) {
    let timeoutNumber: number = -1;
    this.authService.loginExpiryObservable().subscribe(async (timeLeft) => {
      if (timeoutNumber >= 0) {
        clearTimeout(timeoutNumber);
        timeoutNumber = -1;
      }
      const refreshToken = this.authService.getRefreshToken();
      if (timeLeft < 100 && refreshToken) {
        await this.refreshToken();
      } else if (timeLeft >= 100 && refreshToken) {
        timeoutNumber = setTimeout(async () => await this.refreshToken(), timeLeft || undefined);
      }
    });
  }

  private async refreshToken() {
    const { userId, provider, username, roles } = this.authService.getUserDetails();
    const refreshToken = this.authService.getRefreshToken();
    if (userId && provider && refreshToken && username && roles) {
      try {
        var data: any = await this.cognitoService.loginCognitoRefresh(userId, provider);
      } catch (err) {
        await this.cognitoService.logoutCognito();
        this.authService.deleteUserDetails();
        this.router.navigate(['']);
        return;
      }
      const newUserDetails = {
        token: data.token,
        expiresIn: data.expiresIn,
        issuedAt: data.issuedAt,
        refreshToken,
        userId,
        provider,
        username,
        roles,
      };
      this.authService.saveUserDetails(newUserDetails);
    }
  }
}
