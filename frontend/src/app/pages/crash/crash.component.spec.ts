import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashComponent } from './crash.component';

describe('CrashComponent', () => {
  let component: CrashComponent;
  let fixture: ComponentFixture<CrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
