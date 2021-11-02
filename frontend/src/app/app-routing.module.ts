import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlackjackComponent } from './pages/blackjack/blackjack.component';
import { CrashComponent } from './pages/crash/crash.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RouletteComponent } from './pages/roulette/roulette.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'roulette', component: RouletteComponent },
  { path: 'crash', component: CrashComponent },
  { path: 'blackjack', component: BlackjackComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
