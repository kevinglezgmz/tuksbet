import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlackjackComponent } from './pages/blackjack/blackjack.component';
import { CrashComponent } from './pages/crash/crash.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RouletteComponent } from './pages/roulette/roulette.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { UsersComponent } from './pages/users/users.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './common/guards/auth.guard';
import { GameHistoryComponent } from './pages/game-history/game-history.component';
import { GameRoundDetailsComponent } from './pages/game-history/game-round-details/game-round-details.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { SignupComponent } from './pages/signup/signup.component';
import { BetDetailsComponent } from './pages/bet-details/bet-details.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'roulette', component: RouletteComponent },
  { path: 'crash', component: CrashComponent },
  { path: 'blackjack', component: BlackjackComponent },
  { path: 'deposit', component: DepositComponent, canActivate: [AuthGuard] },
  { path: 'withdraw', component: WithdrawComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'users/:userId', component: UserDetailsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'gamehistory', component: GameHistoryComponent },
  { path: 'gamehistory/:gameRoundId', component: GameRoundDetailsComponent },
  { path: 'bets/:betId', component: BetDetailsComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
