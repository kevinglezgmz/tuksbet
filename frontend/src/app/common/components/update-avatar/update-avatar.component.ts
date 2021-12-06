import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-avatar',
  templateUrl: './update-avatar.component.html',

  styleUrls: ['./update-avatar.component.scss'],
})
export class UpdateAvatarComponent implements OnInit {
  @Output() avatarChanged: EventEmitter<string> = new EventEmitter();

  requiredFileType: string = 'img/*';
  updateAvatarForm: FormGroup;
  updateAvatarError: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.updateAvatarForm = this.formBuilder.group({
      newAvatar: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  fileSelected(event: Event) {
    const avatar = (event.target as HTMLInputElement).files![0];

    if (
      avatar.type === 'image/jpeg' ||
      avatar.type === 'image/jpg' ||
      avatar.type === 'image/png' ||
      avatar.type === 'image/gif'
    ) {
      this.updateAvatarForm.get('newAvatar')!.setValue(avatar, { emitModelToViewChange: false });
    } else {
      this.updateAvatarForm.controls['newAvatar'].setErrors({ invalidFileType: true });
    }
  }

  updateAvatar() {
    if (!this.updateAvatarForm.valid) {
      this.updateAvatarError = 'Ingresa una imagen';
      return;
    }
    const imageForm = new FormData();
    imageForm.append('avatar', this.updateAvatarForm.get('newAvatar')!.value);

    const { userId } = this.authService.getUserDetails();

    this.userService
      .updateUser(imageForm, userId!)
      .then((res) => {
        this.openSnackBar('Avatar actualizado correctamente', 'Aceptar');
        this.avatarChanged.emit(res.imgLink);
      })
      .catch((err) => {
        this.updateAvatarError = 'Oops! Ocurrió un error, intenta de nuevo';
      });
  }

  onFileInput() {
    this.updateAvatarError = '';
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}
