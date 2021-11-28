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
  isChatOpen = true;

  constructor(private chatStatusService: ChatStatusService, private bpo: BreakpointObserver) {
    this.chatStatusService.isChatOpen().subscribe((status: boolean) => {
      this.isChatOpen = status;
    });
  }

  mode: MatDrawerMode = 'side';
  opened = true;
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
        console.log('matched');

        this.determineSidenavMode();
        this.determineLayoutGap();
      });
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
    if (this.isExtraSmallDevice() || this.isSmallDevice()) {
      this.layoutGap = '0';
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
}
