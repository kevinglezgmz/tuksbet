import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetDetailsComponent } from './bet-details.component';

describe('BetDetailsComponent', () => {
  let component: BetDetailsComponent;
  let fixture: ComponentFixture<BetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
