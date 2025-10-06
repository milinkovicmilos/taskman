import { TestBed } from '@angular/core/testing';

import { HeaderButton } from './header-button';

describe('HeaderButton', () => {
  let service: HeaderButton;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderButton);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
