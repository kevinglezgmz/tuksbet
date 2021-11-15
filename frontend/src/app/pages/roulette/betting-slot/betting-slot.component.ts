import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bet } from 'src/app/common/data-types/bet';
import { AuthService } from 'src/app/common/services/auth.service';
import { BetHistoryService } from 'src/app/common/services/bet-history.service';
import { WebSocketService } from 'src/app/common/services/web-socket.service';

@Component({
  selector: 'app-betting-slot',
  templateUrl: './betting-slot.component.html',
  styleUrls: ['./betting-slot.component.scss'],
})
export class BettingSlotComponent implements OnInit {
  @Input('bettingColor') bettingColor: string = '';
  @Input('currentGameRoundId') currentGameRoundId: string = '';
  @Input('isLoggedIn') isLoggedIn: boolean = false;
  @Input('betAmount') betAmount: number = 0;
  @Input('currentBets') currentBets: Bet[] = [];

  /** Destroy observables when we leave the page */
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private betService: BetHistoryService,
    private webSocket: WebSocketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.webSocket
      .listen('new-roulette-' + this.bettingColor + '-bet')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((bet: Bet) => {
        this.currentBets.push(bet);
        this.currentBets = this.currentBets.sort((bet1, bet2) => bet2.betAmount - bet1.betAmount);
      });

    this.webSocket
      .listen('roulette-game-round-start')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => (this.currentBets = []));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentBets) {
      this.currentBets = this.currentBets
        .filter((bet) => bet.betStake === 'roulette-' + this.bettingColor)
        .sort((bet1, bet2) => bet2.betAmount - bet1.betAmount);
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
      betStake: 'roulette-' + this.bettingColor,
      betAmount: this.betAmount,
      username: username!,
    };

    this.betService
      .createBet(bet)
      .then((res) => {
        this.currentBets.push(bet);
        // If bet was placed successfuly, notify the other users
        this.webSocket.emit('new-roulette-' + this.bettingColor + '-bet', bet);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
