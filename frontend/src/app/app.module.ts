import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  GoogleLoginProvider,
  SocialLoginModule,
  FacebookLoginProvider,
  SocialAuthServiceConfig,
} from 'angularx-social-login';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouletteComponent } from './pages/roulette/roulette.component';
import { CrashComponent } from './pages/crash/crash.component';
import { BlackjackComponent } from './pages/blackjack/blackjack.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ChatSidebarComponent } from './layout/chat-sidebar/chat-sidebar.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { HttpClientModule } from '@angular/common/http';
import { BetHistoryComponent } from './common/components/bet-history/bet-history.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { UsersComponent } from './pages/users/users.component';
import { LoginComponent } from './pages/login/login.component';
import { ShowIfLoggedDirective } from './common/directives/show-if-logged.directive';
import { GameHistoryComponent } from './pages/game-history/game-history.component';
import { RouletteHistoryComponent } from './pages/game-history/roulette-history/roulette-history.component';
import { CrashHistoryComponent } from './pages/game-history/crash-history/crash-history.component';
import { BlackjackHistoryComponent } from './pages/game-history/blackjack-history/blackjack-history.component';
import { GameRoundDetailsComponent } from './pages/game-history/game-round-details/game-round-details.component';
import { GameShowcaseComponent } from './pages/dashboard/game-showcase/game-showcase.component';

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
    ChatSidebarComponent,
    DepositComponent,
    WithdrawComponent,
    TransactionsComponent,
    BetHistoryComponent,
    UserDetailsComponent,
    UsersComponent,
    LoginComponent,
    ShowIfLoggedDirective,
    GameHistoryComponent,
    RouletteHistoryComponent,
    CrashHistoryComponent,
    BlackjackHistoryComponent,
    GameRoundDetailsComponent,
    GameShowcaseComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, BrowserAnimationsModule, SocialLoginModule],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true, //keeps the user signed in
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
export class AppModule {}
