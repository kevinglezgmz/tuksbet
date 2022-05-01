import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent implements OnInit {
  updatePasswordForm: FormGroup;
  hideActualPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  updatePasswordError: string = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private cognitoService: CognitoService
  ) {
    this.updatePasswordForm = this.formBuilder.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'),
          ],
        ],
        newPasswordConfirm: ['', [Validators.required, Validators.minLength(9)]],
        actualPassword: ['', [Validators.required]],
      },
      {
        validator: this.confirmPasswordValidation,
      }
    );
  }

  ngOnInit(): void {}

  updatePassword() {
    if (this.updatePasswordForm.valid) {
      const actualPassword = this.updatePasswordForm.value.actualPassword;
      const newPassword = this.updatePasswordForm.value.newPassword;
      const { userId } = this.authService.getUserDetails();
      this.cognitoService
        .updatePassword(actualPassword, newPassword)
        .then((res) => {
          this.openSnackBar('Contraseña actualizada correctamente', 'OK');
        })
        .catch((err) => {
          this.updatePasswordError = 'Oops! Ocurrió un error, intenta de nuevo';
        });
    }
  }

  confirmPasswordValidation(form: FormGroup) {
    return form.controls['newPassword'].value === form.controls['newPasswordConfirm'].value ? true : { mismatch: true };
  }

  onPasswordInput() {
    if (
      this.updatePasswordForm.controls['newPassword'].value !== this.updatePasswordForm.controls['newPasswordConfirm'].value
    ) {
      this.updatePasswordForm.controls['newPasswordConfirm'].setErrors({ passwordMismatch: true });
    }
  }

  onInput() {
    this.updatePasswordError = '';
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
