import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Bet } from 'src/app/common/data-types/bet';
import { BlackjackGame } from 'src/app/common/data-types/blackjack-game';
import { AuthService } from 'src/app/common/services/auth.service';
import { BetHistoryService } from 'src/app/common/services/bet-history.service';
import { WebSocketService } from 'src/app/common/services/web-socket.service';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.scss']
})
export class BlackjackComponent implements OnInit {
  game: BlackjackGame = {
    gameStarted: false,
    userPlaying: false,
    dealer: {
      cards: []
    },
    player: {
      cards: []
    }
  };

  bet: Bet | undefined;

  currentBetId: string | undefined;

  currentGameRoundId: string = '';
  betAmount: number = 0;

  constructor(private webSocket: WebSocketService, private betService: BetHistoryService, private authService: AuthService) {
  }

  ngOnInit(): void {
    const { userId, username } = this.authService.getUserDetails();
    this.webSocket.emit('check-if-game', userId);
    this.webSocket
        .listen('init-blackjack')
        .subscribe((game) => {
          if(game === undefined)
            return;

          this.game = game;
          this.currentBetId = game.betId;
          this.currentGameRoundId = game.gameRoundId;

          this.betService.getBetDetails(this.currentBetId!)
                .then((res) => {
                  this.bet = res;
                  this.game.betId = this.bet!._id;
                  this.betAmount = this.bet!.betAmount
                });
        })
    this.webSocket
        .listen('place-blackjack-bet')
        .subscribe((gameRoundId) => {
          this.currentGameRoundId = gameRoundId;
          const bet: Bet = {
            userId: userId!,
            username: username!,
            gameRoundId: gameRoundId,
            betAmount: this.betAmount,
            betStake: 'blackjack-0-hit'
          };
          this.betService
          .createBet(bet)
          .then((res) => {
            this.currentBetId = res.insertedId;
            
            this.betService.getBetDetails(this.currentBetId!)
                .then((res) => {
                  this.bet = res;
                  this.game.betId = this.bet?._id;
                  this.game.gameRoundId = gameRoundId;

                  this.startBlackjackGame();
                });
          })
          .catch((err) => {
                console.log(err);
              });
        });

    this.webSocket
        .listen('blackjack-game-started')
        .subscribe((game) => {
          this.game = game;
        });

    this.webSocket
        .listen('return-hit-blackjack')
        .subscribe((game) => {
          this.game = game;
          this.bet!.betStake = 'blackjack-' + this.game.player!.score!;
          if(this.game.player!.score! >= 21){
            this.bet!.betStake += '-stand';
            this.bet!.betPayout! = (this.game.player!.score! == 21) ? this.betAmount : -this.betAmount;
          }else{
            this.bet!.betStake += '-hit';
          }

          this.updateBet();

          if(!this.game.gameStarted){
            this.closeGameRound();
          }
        });

    this.webSocket
        .listen('return-stand-blackjack')
        .subscribe((game) => {
          this.game = game;

          if(this.game.isDouble){
            this.bet!.betStake = 'blackjack-' + this.game.player!.score! + '-double';
            this.bet!.betAmount = this.betAmount;
          }else{
            this.bet!.betStake = 'blackjack-' + this.game.player!.score! + '-stand';
          }

          if(this.game.winner!.slice(this.game.winner!.length - 3) === 'YOU'){
            this.bet!.betPayout! = this.betAmount;
          } else {
            this.bet!.betPayout! = -this.betAmount;
          }
          

          this.betService.updateBet(this.bet!, this.currentBetId!)
              .then((res) => {
                this.closeGameRound();
              });
        });

        this.webSocket
        .listen('blackjack-gameround-closed')
        .subscribe((game) => {
          this.game = game;
        });
  }

  setBetAmount(event: number) {
    this.betAmount = event;
  }

  blackjackInit() {
    const { userId, username } = this.authService.getUserDetails();
    this.webSocket.emit('init-blackjack-gameround', userId);
  }
  
  startBlackjackGame(){
    this.webSocket.emit('start-blackjack-game', { userId: this.authService.getUserDetails().userId,
                                                  gameRoundId: this.currentGameRoundId,
                                                  betId: this.bet!._id });
  }

  blackjackHit() {
    this.webSocket.emit('hit-blackjack', this.authService.getUserDetails().userId);
  }

  blackjackStand() {
    this.webSocket.emit('stand-blackjack', this.authService.getUserDetails().userId);
  }

  blackjackDouble() {
    this.betAmount += this.betAmount;
    this.webSocket.emit('double-blackjack', this.authService.getUserDetails().userId);
  }

  updateBet() {
    this.betService
        .updateBet(this.bet!, this.bet!._id!)
        .then((res) => { })
        .catch((err) => {
          console.log(err);
        });
  }

  closeGameRound() {
    this.webSocket.emit('close-blackjack-gameroud', {userId: this.authService.getUserDetails().userId, gameroundId: this.currentGameRoundId});
  }
}
