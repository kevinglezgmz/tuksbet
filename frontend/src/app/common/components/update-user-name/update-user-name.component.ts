import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-update-user-name',
  templateUrl: './update-user-name.component.html',
  styleUrls: ['./update-user-name.component.scss'],
})
export class UpdateUserNameComponent implements OnInit {
  @Input() usernameValue: string = '';
  userId: string = '';
  inputUsername: string = '';
  constructor(private userService: UserService, private authService: AuthService) {}

  updateUsername(event: Event) {
    if (this.usernameValue == this.inputUsername) {
      return;
    } else if (this.inputUsername == '') {
      this.inputUsername = this.usernameValue;
      return;
    } else {
      const { userId } = this.authService.getUserDetails();
      this.userId = userId!;
      let newUsername = {
        username: this.inputUsername,
      };
      this.userService.updateUser(newUsername, this.userId);
      window.location.reload();
    }
  }

  ngOnInit(): void {}
}
