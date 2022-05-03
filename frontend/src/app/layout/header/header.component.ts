import { IsDarkThemeService } from './../../common/services/is-dark-theme.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RefreshTokenService } from 'src/app/common/services/refresh-token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isDarkTheme: boolean = false;

  constructor(
    private authService: AuthService,
    private themeStatus: IsDarkThemeService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private refreshTokenService: RefreshTokenService
  ) {
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.matIconRegistry.addSvgIcon(
      'tuksbet',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./../../../assets/imgs/tuksBet.svg')
    );

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
