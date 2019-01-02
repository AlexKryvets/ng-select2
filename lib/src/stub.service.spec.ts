import { TestBed } from '@angular/core/testing';

import { StubService } from './stub.service';

describe('StubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StubService = TestBed.get(StubService);
    expect(service).toBeTruthy();
  });
});
