import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private socialAuthService: SocialAuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.deleteUserDetails();
    const subscription = this.socialAuthService.authState.subscribe((socialUser) => {
      if (socialUser) {
        this.socialAuthService.signOut(true);
      }
    });
    this.router.navigate(['']).finally(() => {
      subscription.unsubscribe();
    });
  }
}
