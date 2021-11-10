import { TestBed } from '@angular/core/testing';

import { GameRoundsService } from './game-rounds.service';

describe('GameRoundsService', () => {
  let service: GameRoundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameRoundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
