import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashHistoryComponent } from './crash-history.component';

describe('CrashHistoryComponent', () => {
  let component: CrashHistoryComponent;
  let fixture: ComponentFixture<CrashHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrashHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrashHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
