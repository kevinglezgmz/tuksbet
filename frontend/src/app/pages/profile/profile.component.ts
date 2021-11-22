import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/common/data-types/users';
import { UserService } from 'src/app/common/services/user.service';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userId: string = '';
  user: User | undefined = undefined;
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    const { userId } = this.authService.getUserDetails();
    this.userId = userId!;
    this.userService.getUserDetails(this.userId).then((user: User) => {
      this.user = user;
      console.log(user);
    });
  }
}
