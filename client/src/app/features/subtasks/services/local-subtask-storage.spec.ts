import { TestBed } from '@angular/core/testing';

import { LocalSubtaskStorage } from './local-subtask-storage';

describe('LocalSubtaskStorage', () => {
  let service: LocalSubtaskStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalSubtaskStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
