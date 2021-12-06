import { TestBed } from '@angular/core/testing';

import { IsDarkThemeService } from './is-dark-theme.service';

describe('IsDarkThemeService', () => {
  let service: IsDarkThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsDarkThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
