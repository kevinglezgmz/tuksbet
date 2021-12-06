import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';
import { AuthService } from 'src/app/common/services/auth.service';
import { LoginService } from 'src/app/common/services/login.service';

const googleLogoURL = 'https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg';
const facebookLogoURL = 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg';

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
    private loginService: LoginService,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon("google", this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
    this.matIconRegistry.addSvgIcon("facebook", this.domSanitizer.bypassSecurityTrustResourceUrl(facebookLogoURL));
  }

  ngOnInit(): void {}

  handleLoginSubmit(event: Event) {
    this.loginService
      .login({ email: this.email, password: this.password })
      .then((userDetailsResponse) => this.loginSuccess(userDetailsResponse))
      .catch((err) => {
        this.loginError = true;
        console.log(err);
      });
  }

  loginWithFacebook() {
    this.loginWithSocial(FacebookLoginProvider.PROVIDER_ID);
  }

  loginWithGoogle() {
    this.loginWithSocial(GoogleLoginProvider.PROVIDER_ID);
  }

  private loginWithSocial(provider: string) {
    this.socialAuthService
      .signIn(provider)
      .then((socialUser) => this.loginService.loginWithSocialNetwork(socialUser))
      .then((userDetailsResponse) => this.loginSuccess(userDetailsResponse))
      .catch((err) => {
        console.log(err);
      });
  }

  private loginSuccess({
    token,
    userId,
    username,
    roles,
  }: {
    token: string;
    userId: string;
    username: string;
    roles: string;
  }): void {
    this.authService.saveUserDetails({ token, userId, username, roles });
    this.router.navigate(['']);
  }

  onInput() {
    this.loginError = false;
  }
}
