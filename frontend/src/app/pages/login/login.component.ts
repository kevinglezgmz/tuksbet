import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';
import { LoginService } from 'src/app/common/services/login.service';
import { ActivatedRoute } from '@angular/router';
import { VerificationService } from 'src/app/common/services/verification.service';
import { CognitoService } from 'src/app/common/services/cognito.service';
import { environment } from 'src/environments/environment';

const googleLogoURL = 'https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg';
const facebookLogoURL = 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg';
const amazonLogoURL = 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  hide: boolean = true;
  loginError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private verificationService: VerificationService,
    private cognitoService: CognitoService
  ) {
    this.matIconRegistry.addSvgIcon('google', this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
    this.matIconRegistry.addSvgIcon('facebook', this.domSanitizer.bypassSecurityTrustResourceUrl(facebookLogoURL));
    this.matIconRegistry.addSvgIcon('amazon', this.domSanitizer.bypassSecurityTrustResourceUrl(amazonLogoURL));
  }

  ngOnInit(): void {
    const token: string | null = this.route.snapshot.queryParamMap.get('token');
    const refreshToken: string | null = this.route.snapshot.queryParamMap.get('refreshToken');
    const expiresInStr: string | null = this.route.snapshot.queryParamMap.get('expiresIn');
    const issuedAtStr: string | null = this.route.snapshot.queryParamMap.get('issuedAt');
    const userId: string | null = this.route.snapshot.queryParamMap.get('userId');
    const username: string | null = this.route.snapshot.queryParamMap.get('username');
    const roles: string | null = this.route.snapshot.queryParamMap.get('roles');
    const provider: string | null = this.route.snapshot.queryParamMap.get('provider');

    if (token && refreshToken && expiresInStr && issuedAtStr && userId && username && roles) {
      const expiresIn = Number(expiresInStr);
      const issuedAt = Number(issuedAtStr);
      this.loginSuccess({ token, refreshToken, expiresIn, issuedAt, userId, username, roles, provider });
    } else if (this.verificationService.completedEmail) {
      this.email = this.verificationService.completedEmail;
      this.verificationService.completedEmail = '';
    }
  }

  handleLoginSubmit(event: Event) {
    this.cognitoService
      .loginCognito({ email: this.email, password: this.password })
      .then((userDetailsResponse) => this.loginSuccess(userDetailsResponse))
      .catch((err) => {
        if (err.error.err === 'User is not confirmed.') {
          this.verificationService.setVerificationEmail(this.email);
          this.router.navigate(['verify']);
        } else {
          this.loginError = true;
        }
      });
  }

  loginWithAmazon() {
    window.location.href =
      'https://tuksbet.auth.us-east-1.amazoncognito.com/oauth2/authorize?&response_type=code&client_id=5ehnt0a3p4t26kggsv4ruind33&redirect_uri=' +
      environment.redirectUrl +
      '&identity_provider=LoginWithAmazon&scope=profile openid';
    return false;
  }

  loginWithGoogle() {
    window.location.href =
      'https://tuksbet.auth.us-east-1.amazoncognito.com/oauth2/authorize?&response_type=code&client_id=5ehnt0a3p4t26kggsv4ruind33&redirect_uri=' +
      environment.redirectUrl +
      '&identity_provider=Google&scope=email profile openid';
    return false;
  }

  private loginSuccess({
    token,
    refreshToken,
    expiresIn,
    issuedAt,
    userId,
    username,
    roles,
    provider,
  }: {
    token: string;
    refreshToken: string;
    expiresIn: number;
    issuedAt: number;
    userId: string;
    username: string;
    roles: string;
    provider: string | null;
  }): void {
    this.authService.saveUserDetails({
      token,
      refreshToken,
      expiresIn,
      issuedAt,
      userId,
      username,
      roles,
      provider,
    });
    this.router.navigate(['']);
  }

  onInput() {
    this.loginError = false;
  }
}
