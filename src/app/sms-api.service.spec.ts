import { TestBed } from '@angular/core/testing';

import { SmsApiService } from './sms-api.service';

describe('SmsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmsApiService = TestBed.get(SmsApiService);
    expect(service).toBeTruthy();
  });
});
