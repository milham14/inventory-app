import { TestBed } from '@angular/core/testing';

import { SembadaService } from './sembada.service';

describe('SembadaService', () => {
  let service: SembadaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SembadaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
