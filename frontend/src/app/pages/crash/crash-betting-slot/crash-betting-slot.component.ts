import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bet } from 'src/app/common/data-types/bet';
import { CrashStates } from 'src/app/common/data-types/crash-game-types';
import { AuthService } from 'src/app/common/services/auth.service';
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
  currentBetId: string | undefined;

  /** Destroy observables when we leave the page */
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private betService: BetHistoryService,
    private webSocket: WebSocketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.webSocket
      .listen('new-crash-bet')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((bet: Bet) => {
        this.currentBets.push(bet);
        this.currentBets = this.currentBets.sort((bet1, bet2) => bet2.betAmount - bet1.betAmount);
      });

    this.webSocket
      .listen('crash-game-round-waiting-status')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => (this.currentBets = []));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentBets) {
      this.currentBets = this.currentBets.sort((bet1, bet2) => bet2.betAmount - bet1.betAmount);
    } else if (changes.crashState) {
      const newState: CrashStates = changes.crashState.currentValue;
      if (newState === 'CRASHED' || newState === 'WAITING') {
        this.currentBetId = undefined;
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
        this.currentBetId = res.insertedId;
        this.currentBets.push(bet);
        // If bet was placed successfuly, notify the other users
        this.webSocket.emit('new-crash-bet', bet);
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
      betStake: 'crash-' + this.currentMultiplier + 'x',
      betAmount: this.betAmount,
    };

    this.betService
      .updateBet(bet, this.currentBetId || '')
      .then((res) => {
        // Here we could maybe update the bet visually and notify the other users that a user exited the crash
      })
      .catch((err) => {});
  }

  onBlur(event: Event) {
    const number = isNaN(Number(this.betToCrashAt)) ? 0 : Number(this.betToCrashAt);
    this.betToCrashAt = number.toFixed(2);
  }
}
