import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/common/services/cognito.service';
import { LoginService } from 'src/app/common/services/login.service';
import { VerificationService } from 'src/app/common/services/verification.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
})
export class VerifyAccountComponent implements OnInit {
  codigoVerificacion: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private verificationService: VerificationService,
    private cognitoService: CognitoService
  ) {}

  ngOnInit(): void {
    if (this.verificationService.needsVerification()) {
      this.email = this.verificationService.getVerificationEmail();
    } else {
      this.router.navigate(['']);
    }
  }

  handleCodeSubmit(event: Event) {
    this.cognitoService
      .verifyAccountCognito({ email: this.email, confirmationCode: this.codigoVerificacion })
      .then(() => {
        this.verificationService.completeVerification();
        this.snackBar.open('Cuenta verificada! Por favor, inicia sesión.', 'Aceptar', {
          duration: 5000,
        });
        this.router.navigate(['login']);
      })
      .catch(() => {
        this.snackBar.open('Código incorrecto, intenta de nuevo.', 'Aceptar', {
          duration: 3000,
        });
      });
  }

  resendVerificationCode() {
    this.cognitoService
      .resendVerifyCodeCognito(this.email)
      .then(() => {
        this.snackBar.open('Código reenviado correctamente.', 'Aceptar', {
          duration: 3000,
        });
      })
      .catch(() => {
        this.snackBar.open('No se pudo reenviar el codigo nuevamente.', 'Aceptar', {
          duration: 3000,
        });
      });
  }

  cancelVerification() {
    this.verificationService.cancelVerification();
    this.router.navigate(['login']);
  }
}
