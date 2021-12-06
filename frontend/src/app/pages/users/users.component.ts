import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ConfirmDialogContentComponent } from 'src/app/common/components/confirm-dialog-content/confirm-dialog-content.component';
import { User } from 'src/app/common/data-types/users';
import { AuthService } from 'src/app/common/services/auth.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  columnsToDisplay: string[] = ['Username', 'Email', 'Actions'];

  recordsPerPage: number = 10;
  currentPage: number = 0;
  subscriptions: Subscription;

  roles: string = '';

  constructor(private userService: UserService, private authService: AuthService, private dialog: MatDialog) {
    this.subscriptions = this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.roles = authService.getUserDetails().roles || '';
    });
  }

  ngOnInit(): void {
    this.getPaginatedUsers(0, 10);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onPageChange(event: PageEvent) {
    this.recordsPerPage = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPaginatedUsers(event.pageIndex, this.recordsPerPage);
  }

  getPaginatedUsers(currentPagination: number, recordsPerPage: number) {
    this.userService.getAllUsers(currentPagination, recordsPerPage).then((users: User[]) => {
      this.users = users;
    });
  }

  deleteUser(userId: string): void {
    this.userService
      .deleteUser(userId)
      .then((msg) => {
        this.getPaginatedUsers(this.currentPage, this.recordsPerPage);
      })
      .catch((err) => {
        console.log('Hubo un problema en la eliminación del usuario');
      });
  }

  openDeleteConfirmDialog(userId: string, username: string) {
    const dialogRef = this.dialog.open(ConfirmDialogContentComponent, {
      data: {
        title: '¿Borrar usuario?',
        body: '¿Está seguro que desea eliminar al usuario ' + username + '? Esta acción no puede deshacerse.',
        isDelete: true,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(userId);
      }
    });
  }
}
