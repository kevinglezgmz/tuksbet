import { IsDarkThemeService } from './common/services/is-dark-theme.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChatStatusService } from './common/services/chat-status.service';
import { map } from 'rxjs/operators';
import { MatDrawerMode } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tuksbet-front';
  isChatOpen: boolean = false;
  isDarkTheme: boolean = false;

  constructor(
    private chatStatusService: ChatStatusService,
    private themeStatus: IsDarkThemeService,
    private bpo: BreakpointObserver
  ) {
    this.chatStatusService.isChatOpen().subscribe((status: boolean) => {
      this.isChatOpen = status;
    });

    this.themeStatus.isCurrentThemeDark().subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
  }

  mode: MatDrawerMode = 'side';
  layoutGap = '64';
  fixedInViewport = true;

  public ngOnInit(): void {
    // This helps hiding our key from index view
    document.getElementById('paypalremove')?.remove();

    const breakpoints = Object.keys(Breakpoints).map((key, index) => Object.values(Breakpoints)[index]);
    this.bpo
      .observe(breakpoints)
      .pipe(map((bst) => bst.matches))
      .subscribe((matched) => {
        this.determineSidenavMode();
        this.determineLayoutGap();
      });

    this.isDarkTheme = localStorage.getItem('theme') === 'Dark' ? true : false;
  }

  private determineSidenavMode(): void {
    if (this.isExtraSmallDevice() || this.isSmallDevice()) {
      this.fixedInViewport = false;
      this.mode = 'over';
      // this.opened = false;
      return;
    }

    this.fixedInViewport = true;
    this.mode = 'side';
  }

  private determineLayoutGap(): void {
    if (this.isExtraSmallDevice()) {
      this.layoutGap = '56';
      return;
    }

    this.layoutGap = '64';
  }

  public isExtraSmallDevice(): boolean {
    return this.bpo.isMatched(Breakpoints.XSmall);
  }

  public isSmallDevice(): boolean {
    return this.bpo.isMatched(Breakpoints.Small);
  }

  public chatToggle() {
    if (this.isChatOpen) {
      this.chatStatusService.chatClose();
    } else {
      this.chatStatusService.chatOpen();
    }
  }
}
