import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletComponentComponent } from './wallet-component.component';

describe('WalletComponentComponent', () => {
  let component: WalletComponentComponent;
  let fixture: ComponentFixture<WalletComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
