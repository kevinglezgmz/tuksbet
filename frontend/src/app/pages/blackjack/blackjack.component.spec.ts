import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackjackComponent } from './blackjack.component';

describe('BlackjackComponent', () => {
  let component: BlackjackComponent;
  let fixture: ComponentFixture<BlackjackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlackjackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackjackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
