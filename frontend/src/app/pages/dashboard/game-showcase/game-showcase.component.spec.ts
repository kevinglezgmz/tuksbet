import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameShowcaseComponent } from './game-showcase.component';

describe('GameShowcaseComponent', () => {
  let component: GameShowcaseComponent;
  let fixture: ComponentFixture<GameShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameShowcaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
