import { TestBed } from '@angular/core/testing';

import { ServerTaskStorage } from './server-task-storage';

describe('ServerTaskStorage', () => {
  let service: ServerTaskStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerTaskStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
