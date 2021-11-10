import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private loginService: LoginService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  handleLoginSubmit(event: Event) {
    this.loginService
      .login({ email: this.email, password: this.password })
      .then(({ token, userId, username }: { token: string; userId: string; username: string }) => {
        this.authService.saveUserDetails({ token, userId, username });
        this.router.navigate(['']);
      })
      .catch((res) => {
        /** TODO:
         * - Display errors to the user (invalid credentials)
         */
      });
  }
}
