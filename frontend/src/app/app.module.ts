import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  GoogleLoginProvider,
  SocialLoginModule,
  FacebookLoginProvider,
  SocialAuthServiceConfig,
} from 'angularx-social-login';

import { MaterialModule } from './common/modules/material/material.module';

import { OverlayContainer } from '@angular/cdk/overlay';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouletteComponent } from './pages/roulette/roulette.component';
import { CrashComponent } from './pages/crash/crash.component';
import { BlackjackComponent } from './pages/blackjack/blackjack.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ChatSidenavTab } from './layout/chat-sidenav/chat-sidenav-tab/chat-sidenav-tab.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { HttpClientModule } from '@angular/common/http';
import { BetHistoryComponent } from './common/components/bet-history/bet-history.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { UsersComponent } from './pages/users/users.component';
import { LoginComponent } from './pages/login/login.component';
import { ShowIfLoggedDirective } from './common/directives/show-if-logged.directive';
import { GameHistoryComponent } from './common/components/game-history/game-history.component';
import { GameRoundDetailsComponent } from './pages/game-history/game-round-details/game-round-details.component';
import { GameShowcaseComponent } from './pages/dashboard/game-showcase/game-showcase.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { BetDetailsComponent } from './pages/bet-details/bet-details.component';
import { TransactionDetailsComponent } from './pages/transaction-details/transaction-details.component';
import { NDecimalPlacesDirective } from './common/directives/n-decimal-places.directive';
import { BettingSlotComponent } from './pages/roulette/betting-slot/betting-slot.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UpdateUserNameComponent } from './common/components/update-user-name/update-user-name.component';
import { UpdatePasswordComponent } from './common/components/update-password/update-password.component';
import { UpdateAvatarComponent } from './common/components/update-avatar/update-avatar.component';
import { CrashBettingSlotComponent } from './pages/crash/crash-betting-slot/crash-betting-slot.component';
import { BetAmountSelectorComponent } from './common/components/bet-amount-selector/bet-amount-selector.component';
import { ChatSidenavTabGroupComponent } from './layout/chat-sidenav/chat-sidenav-tab-group/chat-sidenav-tab-group.component';
import { ConfirmDialogContentComponent } from './common/components/confirm-dialog-content/confirm-dialog-content.component';
import { WalletComponentComponent } from './layout/wallet-component/wallet-component.component';
import { IsDarkThemeService } from './common/services/is-dark-theme.service';
import { VerifyAccountComponent } from './pages/verify-account/verify-account.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    RouletteComponent,
    CrashComponent,
    BlackjackComponent,
    NotFoundComponent,
    FooterComponent,
    ChatSidenavTab,
    DepositComponent,
    WithdrawComponent,
    TransactionsComponent,
    BetHistoryComponent,
    UserDetailsComponent,
    UsersComponent,
    LoginComponent,
    ShowIfLoggedDirective,
    GameHistoryComponent,
    GameRoundDetailsComponent,
    GameShowcaseComponent,
    LogoutComponent,
    SignupComponent,
    BetDetailsComponent,
    TransactionDetailsComponent,
    NDecimalPlacesDirective,
    BettingSlotComponent,
    BetAmountSelectorComponent,
    ProfileComponent,
    UpdateUserNameComponent,
    UpdatePasswordComponent,
    UpdateAvatarComponent,
    CrashBettingSlotComponent,
    ChatSidenavTabGroupComponent,
    ConfirmDialogContentComponent,
    WalletComponentComponent,
    VerifyAccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('961252936672-rlmniuqk2sv5858v3ljbm18kqts2fc7l.apps.googleusercontent.com'),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('555113948919381'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer, isDarkThemeActive: IsDarkThemeService) {
    isDarkThemeActive.isCurrentThemeDark().subscribe((isDark) => {
      if (isDark) {
        overlayContainer.getContainerElement().classList.add('dark-theme-mode');
      } else {
        overlayContainer.getContainerElement().classList.remove('dark-theme-mode');
      }
    });
  }
}
