import { IsDarkThemeService } from './../../common/services/is-dark-theme.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isDarkTheme: boolean = false;

  constructor(private authService: AuthService, private themeStatus: IsDarkThemeService) {
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.themeStatus.isCurrentThemeDark().subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
  }

  ngOnInit(): void {}

  updateCurrentTheme() {
    if (this.isDarkTheme) {
      this.themeStatus.setDarkTheme();
    } else {
      this.themeStatus.setLightTheme();
    }
  }

  setMode() {
    if (this.isDarkTheme) {
      this.isDarkTheme = false;
    } else {
      this.isDarkTheme = true;
    }
    this.updateCurrentTheme();
  }
}
