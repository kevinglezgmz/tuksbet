import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouletteHistoryComponent } from './roulette-history.component';

describe('RouletteHistoryComponent', () => {
  let component: RouletteHistoryComponent;
  let fixture: ComponentFixture<RouletteHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouletteHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouletteHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
