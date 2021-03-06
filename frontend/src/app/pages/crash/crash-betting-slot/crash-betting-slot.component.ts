import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bet } from 'src/app/common/data-types/bet';
import { CrashStates } from 'src/app/common/data-types/crash-game-types';
import { AuthService } from 'src/app/common/services/auth.service';
import { BalanceService } from 'src/app/common/services/balance.service';
import { BetHistoryService } from 'src/app/common/services/bet-history.service';
import { WebSocketService } from 'src/app/common/services/web-socket.service';

@Component({
  selector: 'app-crash-betting-slot',
  templateUrl: './crash-betting-slot.component.html',
  styleUrls: ['./crash-betting-slot.component.scss'],
})
export class CrashBettingSlotComponent implements OnInit {
  @Input('currentGameRoundId') currentGameRoundId: string = '';
  @Input('isLoggedIn') isLoggedIn: boolean = false;
  @Input('betAmount') betAmount: number = 0;
  @Input('currentBets') currentBets: Bet[] = [];
  @Input('crashState') crashState: CrashStates = CrashStates.WAITING;
  @Input('currentMultiplier') currentMultiplier: number = 1.0;
  betToCrashAt: string = '2.0';
  currentBet: Bet | undefined;

  currentBetsInternal: Bet[] = [];

  /** Destroy observables when we leave the page */
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private betService: BetHistoryService,
    private webSocket: WebSocketService,
    private authService: AuthService,
    private balanceService: BalanceService
  ) {}

  ngOnInit(): void {
    this.webSocket
      .listen('crash-game-round-waiting-status')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => (this.currentBets = []));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentMultiplier) {
      return;
    }
    if (changes.currentBets) {
      this.currentBetsInternal = this.currentBets.sort((bet1, bet2) => bet2.betAmount - bet1.betAmount);
      const { userId } = this.authService.getUserDetails();
      this.currentBet = this.currentBets.find((bet) => bet.userId === userId);
    } else if (changes.crashState) {
      const newState: CrashStates = changes.crashState.currentValue;
      if (newState === 'CRASHED' || newState === 'WAITING') {
        this.currentBet = undefined;
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }

  onClickBet($event: MouseEvent) {
    if (!this.isLoggedIn) {
      return;
    }
    const { userId, username } = this.authService.getUserDetails();
    const bet: Bet = {
      userId: userId!,
      gameRoundId: this.currentGameRoundId,
      betStake: 'crash-' + this.betToCrashAt + 'x' + '-running',
      betAmount: this.betAmount,
      username: username!,
    };

    this.betService
      .createBet(bet)
      .then((res) => {
        this.currentBet = bet;
        this.currentBet._id = res.insertedId;
        this.currentBetsInternal.push(bet);
        this.currentBetsInternal = this.currentBetsInternal.sort((bet1, bet2) => bet2.betAmount - bet1.betAmount);
        // If bet was placed successfuly, notify the other users
        this.webSocket.emit('new-crash-bet', bet);
        this.balanceService.updateUserBalance();
      })
      .catch((err) => {});
  }

  onClickExitCrash($event: MouseEvent) {
    if (!this.isLoggedIn) {
      return;
    }
    const { userId, username } = this.authService.getUserDetails();
    const bet: Bet = {
      userId: userId!,
      gameRoundId: this.currentGameRoundId,
      betStake: 'crash-' + this.currentMultiplier + 'x-exited',
      betAmount: this.betAmount,
    };

    this.betService
      .updateBet(bet, this.currentBet?._id || '')
      .then((res) => {
        // Here we could maybe update the bet visually and notify the other users that a user exited the crash
        this.currentBet = bet;
      })
      .catch((err) => {});
  }

  onBlur(event: Event) {
    const number = isNaN(Number(this.betToCrashAt)) ? 0 : Number(this.betToCrashAt);
    this.betToCrashAt = number.toFixed(2);
  }
}
