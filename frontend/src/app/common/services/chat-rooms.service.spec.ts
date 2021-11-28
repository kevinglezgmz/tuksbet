import { TestBed } from '@angular/core/testing';

import { ChatRoomsService } from './chat-rooms.service';

describe('ChatRoomsService', () => {
  let service: ChatRoomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
