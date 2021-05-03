import { TestBed } from '@angular/core/testing';

import { ApiWatcherService } from './api-watcher.service';

describe('ApiWatcherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiWatcherService = TestBed.get(ApiWatcherService);
    expect(service).toBeTruthy();
  });
});
