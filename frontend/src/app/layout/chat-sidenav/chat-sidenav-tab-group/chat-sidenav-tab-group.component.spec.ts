import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSidenavTabGroupComponent } from './chat-sidenav-tab-group.component';

describe('ChatSidenavTabGroupComponent', () => {
  let component: ChatSidenavTabGroupComponent;
  let fixture: ComponentFixture<ChatSidenavTabGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatSidenavTabGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSidenavTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
