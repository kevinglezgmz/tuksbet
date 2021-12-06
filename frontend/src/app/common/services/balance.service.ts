import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../data-types/users';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  currentBalance: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private userService: UserService, private authService: AuthService, private socketService: WebSocketService) {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.updateUserBalance();
      } else {
        this.currentBalance.next(0);
      }
    });

    this.socketService.listen('update-balance').subscribe((data) => {
      if (authService.loginStatus.value) {
        this.updateUserBalance();
      }
    });
  }

  userBalanceStatus(): Observable<number> {
    return this.currentBalance.asObservable();
  }

  updateUserBalance(): void {
    this.userService
      .getUserDetails(this.authService.getUserDetails().userId!)
      .then((userData: User) => this.currentBalance.next(Number(userData.balance) || 0));
  }
}
