import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/common/services/user.service';
import { LoginService } from 'src/app/common/services/login.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';
import { VerificationService } from 'src/app/common/services/verification.service';
import { CognitoService } from 'src/app/common/services/cognito.service';

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
    private verificationService: VerificationService,
    private cognitoService: CognitoService
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
    if (this.form.valid) {
      let newUser = this.form.value;
      delete newUser.confirm;

      this.cognitoService
        .createUserCognito(newUser)
        .then(() => {
          this.verificationService.setVerificationEmail(newUser.email);
          this.router.navigate(['verify']);
        })
        .catch((err) => {
          console.log(err);
          if (
            err.error.err === 'This user already exists' ||
            err.error.err === 'This email is already registered. Try to login with your account.'
          ) {
            this.signupError = 'Ese usuario ya existe, intenta con otro correo';
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
