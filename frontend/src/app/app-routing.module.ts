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

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'roulette', component: RouletteComponent },
  { path: 'crash', component: CrashComponent },
  { path: 'blackjack', component: BlackjackComponent },
  { path: 'deposit', component: DepositComponent },
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:userId', component: UserDetailsComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
