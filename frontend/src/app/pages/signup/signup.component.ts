import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/common/services/user.service';
import { LoginService } from 'src/app/common/services/login.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  signupError: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private loginService: LoginService,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'),
          ],
        ],
        confirm: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validator: this.confirmPasswordValidation,
      }
    );
  }

  ngOnInit(): void {}

  signUp() {
    console.log(this.form);
    if (this.form.valid) {
      let newUser = this.form.value;
      delete newUser.confirm;

      this.userService
        .createUser(newUser)
        .then(() => {
          delete newUser.username;

          this.loginService.login(newUser).then((userDetails) => {
            this.authService.saveUserDetails({
              token: userDetails.token,
              userId: userDetails.userId,
              username: userDetails.username,
              roles: userDetails.roles,
            });
            this.router.navigate(['']);
          });
        })
        .catch((err) => {
          console.log(err.error);
          if (err.error.err === 'This user already exists') {
            this.signupError = 'Ese usuario ya existe';
          } else {
            this.signupError = 'Ocurrió un error, intenta de nuevo';
          }
        });
    }
  }

  confirmPasswordValidation(form: FormGroup) {
    return form.controls['password'].value === form.controls['confirm'].value ? true : { mismatch: true };
  }

  onPasswordInput() {
    if (this.form.controls['password'].value !== this.form.controls['confirm'].value) {
      this.form.controls['confirm'].setErrors({ passwordMismatch: true });
    }
  }

  onInput() {
    this.signupError = '';
  }
}
