import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetAmountSelectorComponent } from './bet-amount-selector.component';

describe('BetAmountSelectorComponent', () => {
  let component: BetAmountSelectorComponent;
  let fixture: ComponentFixture<BetAmountSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetAmountSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetAmountSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
