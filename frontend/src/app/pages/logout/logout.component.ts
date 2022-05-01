import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';
import { CognitoService } from 'src/app/common/services/cognito.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private cognitoService: CognitoService) {}

  ngOnInit(): void {
    this.cognitoService
      .logoutCognito()
      .then(() => {
        this.authService.deleteUserDetails();
        this.router.navigate(['']);
      })
      .catch(() => {
        alert('error');
        this.authService.deleteUserDetails();
        this.router.navigate(['']);
      });
  }
}
