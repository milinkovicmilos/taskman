import { TestBed } from '@angular/core/testing';

import { LocalTaskStorage } from './local-task-storage';

describe('LocalTaskStorage', () => {
  let service: LocalTaskStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalTaskStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
