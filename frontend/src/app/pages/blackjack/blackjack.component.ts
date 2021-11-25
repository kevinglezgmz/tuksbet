import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bet } from 'src/app/common/data-types/bet';
import { BlackjackGame } from 'src/app/common/data-types/blackjack-game';
import { AuthService } from 'src/app/common/services/auth.service';
import { BetHistoryService } from 'src/app/common/services/bet-history.service';
import { WebSocketService } from 'src/app/common/services/web-socket.service';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.scss'],
})
export class BlackjackComponent implements OnInit {
  game: BlackjackGame = {
    gameStarted: false,
    userPlaying: false,
    dealer: {
      cards: [],
    },
    player: {
      cards: [],
    },
  };

  currentBetId: string = '';
  currentGameRoundId: string = '';
  betAmount: number = 0;

  bet: Bet = {
    betAmount: this.betAmount,
    userId: this.authService.getUserDetails().userId || '',
    gameRoundId: this.currentGameRoundId,
  };

  /** Destroy observables when we leave the page */
  private unsubscribe: Subject<void> = new Subject<void>();
  constructor(private webSocket: WebSocketService, private betService: BetHistoryService, private authService: AuthService) {
    const { userId, username } = this.authService.getUserDetails();
    this.webSocket.emit('check-if-game', userId);

    this.webSocket
      .listen('init-blackjack')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((game) => {
        if (game === undefined) return;
        this.game = game;
        this.currentBetId = game.betId;
        this.currentGameRoundId = game.gameRoundId;
        this.betService
          .getBetDetails(this.currentBetId)
          .then((res) => {
            this.bet = res;
            this.betAmount = this.bet.betAmount || 0;
          })
          .catch(() => {});
      });

    this.webSocket
      .listen('place-blackjack-bet')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((gameRoundId) => {
        this.currentGameRoundId = gameRoundId;
        const bet: Bet = {
          userId: userId!,
          username: username!,
          gameRoundId: gameRoundId,
          betAmount: this.betAmount,
          betStake: 'blackjack-0-hit',
        };
        this.betService
          .createBet(bet)
          .then((res) => {
            this.currentBetId = res.insertedId;
            this.bet = bet;
            this.game.betId = res.insertedId;
            this.game.gameRoundId = gameRoundId;
            this.startBlackjackGame();
          })
          .catch((err) => {});
      });

    this.webSocket
      .listen('blackjack-game-started')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((game) => {
        this.game = game;
      });

    this.webSocket
      .listen('return-hit-blackjack')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((game) => {
        this.game = game;
        this.bet!.betStake = 'blackjack-' + this.game.player!.score!;
        if (this.game.player!.score! >= 21) {
          this.bet!.betStake += '-stand';
        } else {
          this.bet!.betStake += '-hit';
        }
        this.betService
          .updateBet(this.bet!, this.currentBetId!)
          .then((res) => {
            if (!this.game.gameStarted) {
              this.closeGameRound();
            }
          })
          .catch(() => {});
      });

    this.webSocket
      .listen('return-stand-blackjack')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((game) => {
        this.game = game;

        if (this.game.isDouble) {
          this.bet!.betStake = 'blackjack-' + this.game.player!.score! + '-double';
          this.bet!.betAmount = this.bet.betAmount * 2;
        } else {
          this.bet!.betStake = 'blackjack-' + this.game.player!.score! + '-stand';
        }

        this.betService
          .updateBet(this.bet!, this.currentBetId!)
          .then((res) => {
            this.closeGameRound();
          })
          .catch(() => {});
      });

    this.webSocket
      .listen('blackjack-gameround-closed')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((game) => {
        this.bet = {
          betAmount: this.betAmount,
          userId: this.authService.getUserDetails().userId || '',
          gameRoundId: this.currentGameRoundId,
        };
        this.game = game;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }

  setBetAmount(event: number) {
    this.betAmount = event;
  }

  blackjackInit() {
    const { userId, username } = this.authService.getUserDetails();
    this.webSocket.emit('init-blackjack-gameround', userId);
  }

  startBlackjackGame() {
    this.webSocket.emit('start-blackjack-game', {
      userId: this.authService.getUserDetails().userId,
      gameRoundId: this.currentGameRoundId,
      betId: this.currentBetId,
    });
  }

  blackjackHit() {
    this.webSocket.emit('hit-blackjack', this.authService.getUserDetails().userId);
  }

  blackjackStand() {
    this.webSocket.emit('stand-blackjack', this.authService.getUserDetails().userId);
  }

  blackjackDouble() {
    // balance still needs to be checked
    this.webSocket.emit('double-blackjack', this.authService.getUserDetails().userId);
  }

  closeGameRound() {
    this.webSocket.emit('close-blackjack-gameroud', {
      userId: this.authService.getUserDetails().userId,
      gameroundId: this.currentGameRoundId,
    });
  }
}
