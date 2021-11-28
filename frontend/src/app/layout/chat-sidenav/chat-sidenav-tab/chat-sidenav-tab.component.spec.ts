import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSidenavTab } from './chat-sidenav-tab.component';

describe('ChatSidenavTab', () => {
  let component: ChatSidenavTab;
  let fixture: ComponentFixture<ChatSidenavTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatSidenavTab],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSidenavTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
