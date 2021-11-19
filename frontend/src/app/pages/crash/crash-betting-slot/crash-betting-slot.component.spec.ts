import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashBettingSlotComponent } from './crash-betting-slot.component';

describe('CrashBettingSlotComponent', () => {
  let component: CrashBettingSlotComponent;
  let fixture: ComponentFixture<CrashBettingSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrashBettingSlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrashBettingSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
