import { TestBed } from '@angular/core/testing';

import { LocalProjectStorage } from './local-project-storage';

describe('LocalProjectStorage', () => {
  let service: LocalProjectStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalProjectStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
