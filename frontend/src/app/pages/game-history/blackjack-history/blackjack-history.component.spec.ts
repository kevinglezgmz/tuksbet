import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackjackHistoryComponent } from './blackjack-history.component';

describe('BlackjackHistoryComponent', () => {
  let component: BlackjackHistoryComponent;
  let fixture: ComponentFixture<BlackjackHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlackjackHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackjackHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
