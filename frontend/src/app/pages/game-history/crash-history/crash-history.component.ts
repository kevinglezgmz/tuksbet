import { Component, OnInit } from '@angular/core';
import { GameRound } from 'src/app/common/data-types/gameRounds';
import { GameRoundsService } from 'src/app/common/services/game-rounds.service';

@Component({
  selector: 'app-crash-history',
  templateUrl: './crash-history.component.html',
  styleUrls: ['./crash-history.component.scss'],
})
export class CrashHistoryComponent implements OnInit {
  gamerounds: GameRound[] = [];
  constructor(private gameRoundService: GameRoundsService) {}

  ngOnInit(): void {
    this.gameRoundService.getAllGameRounds().then((gamerounds: GameRound[]) => {
      this.gamerounds = gamerounds.filter((gameround) => gameround.gameName === 'Crash').reverse();
    });
  }
}

function filterArray(id: string, array: GameRound[]) {
  let numbersOut: GameRound[] = [];
  array.forEach((element) => {
    if (element.gameId == id) {
      numbersOut.push(element);
    }
  });
  return numbersOut.reverse();
}
