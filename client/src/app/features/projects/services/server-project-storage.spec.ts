import { TestBed } from '@angular/core/testing';

import { ServerProjectStorage } from './server-project-storage';

describe('ServerProjectStorage', () => {
  let service: ServerProjectStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerProjectStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
