import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent implements OnInit {
  userId: string = '';
  inputPassword: string = '';
  inputPasswordConfirm: string = '';
  constructor(private userService: UserService, private authService: AuthService) {}

  updatePassword(event: Event) {
    if (this.inputPassword == '' || this.inputPasswordConfirm == '') {
      console.log('An input is empty');
      return;
    } else if (this.inputPassword != this.inputPasswordConfirm) {
      console.log('Passwords are not the same');
      return;
    } else {
      const { userId } = this.authService.getUserDetails();
      this.userId = userId!;
      let newPassword = {
        password: this.inputPassword,
      };
      this.userService.updateUser(newPassword, this.userId);
    }
  }

  ngOnInit(): void {}
}
