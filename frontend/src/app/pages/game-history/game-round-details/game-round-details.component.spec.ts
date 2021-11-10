import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoundDetailsComponent } from './game-round-details.component';

describe('GameRoundDetailsComponent', () => {
  let component: GameRoundDetailsComponent;
  let fixture: ComponentFixture<GameRoundDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameRoundDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoundDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
