import { TestBed } from '@angular/core/testing';

import { MaxSliderService } from './max-slider.service';

describe('MaxSliderService', () => {
  let service: MaxSliderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaxSliderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
