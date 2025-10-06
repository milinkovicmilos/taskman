import { TestBed } from '@angular/core/testing';

import { ServerSubtaskStorage } from './server-subtask-storage';

describe('ServerSubtaskStorage', () => {
  let service: ServerSubtaskStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerSubtaskStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
