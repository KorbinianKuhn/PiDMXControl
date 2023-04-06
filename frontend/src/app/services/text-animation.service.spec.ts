import { TestBed } from '@angular/core/testing';

import { TextAnimationService } from './text-animation.service';

describe('TextAnimationService', () => {
  let service: TextAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
