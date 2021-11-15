import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingSlotComponent } from './betting-slot.component';

describe('BettingSlotComponent', () => {
  let component: BettingSlotComponent;
  let fixture: ComponentFixture<BettingSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BettingSlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
