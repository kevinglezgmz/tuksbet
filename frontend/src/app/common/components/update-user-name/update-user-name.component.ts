import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-user-name',
  templateUrl: './update-user-name.component.html',
  styleUrls: ['./update-user-name.component.scss'],
})
export class UpdateUserNameComponent implements OnInit {
  @Input() usernameValue: string = '';
  @Output() usernameChanged: EventEmitter<string> = new EventEmitter();

  userId: string = '';
  inputUsername: string = '';
  updateUsernameForm: FormGroup;
  updateUsernameError: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.updateUsernameForm = this.formBuilder.group({
      newUsername: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  updateUsername() {
    if (!this.updateUsernameForm.valid) {
      this.updateUsernameError = 'Ingresa un nuevo nombre de usuario';
      return;
    }

    this.inputUsername = this.updateUsernameForm.value.newUsername;

    if (this.usernameValue === this.inputUsername) {
      this.updateUsernameForm.controls['newUsername'].setErrors({ sameUsername: true });
    } else {
      const { userId } = this.authService.getUserDetails();
      this.userId = userId!;
      let newUsername = {
        username: this.inputUsername,
      };
      this.userService
        .updateUser(newUsername, this.userId)
        .then((res) => {
          this.openSnackBar('Nombre de usuario actualizado correctamente', 'OK');
          this.usernameChanged.emit(newUsername.username);
        })
        .catch((err) => {
          this.updateUsernameError = 'Oops! Ocurrió un error, intenta de nuevo';
        });
    }
  }

  onNewUsernameInput() {
    if (this.updateUsernameForm.value.newUsername === this.usernameValue) {
      this.updateUsernameForm.controls['newUsername'].setErrors({ sameUsername: true });
    }
  }

  onInput() {
    this.updateUsernameError = '';
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}
