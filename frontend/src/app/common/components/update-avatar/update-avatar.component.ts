import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-update-avatar',
  templateUrl: './update-avatar.component.html',
  styleUrls: ['./update-avatar.component.scss'],
})
export class UpdateAvatarComponent implements OnInit {
  avatarObject: File | undefined = undefined;
  userId: string = '';

  constructor(private userService: UserService, private authService: AuthService) {}

  fileSelected(event: Event) {
    const avatar = (event.target as HTMLInputElement).files![0];
    this.avatarObject = avatar;
  }

  updateAvatar(event: Event) {
    if (this.avatarObject === undefined) {
      return;
    } else {
      const imageForm = new FormData();
      imageForm.append('avatar', this.avatarObject);

      const { userId } = this.authService.getUserDetails();
      this.userId = userId!;

      this.userService.updateUser(imageForm, this.userId).then((res) => {
        window.location.reload();
      });
    }
  }
  ngOnInit(): void {}
}
