import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/data-types/users';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  columnsToDisplay: string[] = ['Username', 'Email'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().then((users: User[]) => {
      this.users = users.reverse();
      console.log(this.users);
    });
  }
}
