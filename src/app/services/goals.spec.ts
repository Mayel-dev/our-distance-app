import { TestBed } from '@angular/core/testing';

import { Goals } from './goals.service';

describe('Goals', () => {
  let service: Goals;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Goals);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
