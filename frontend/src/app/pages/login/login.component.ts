import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';
import { AuthService } from 'src/app/common/services/auth.service';
import { LoginService } from 'src/app/common/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  handleLoginSubmit(event: Event) {
    this.loginService
      .login({ email: this.email, password: this.password })
      .then((userDetailsResponse) => this.loginSuccess(userDetailsResponse))
      .catch((err) => {
        /** TODO:
         * - Display errors to the user (invalid credentials)
         */
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

  private loginSuccess({ token, userId, username }: { token: string; userId: string; username: string }): void {
    this.authService.saveUserDetails({ token, userId, username });
    this.router.navigate(['']);
  }
}
