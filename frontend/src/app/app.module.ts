import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    GameShowcaseComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
