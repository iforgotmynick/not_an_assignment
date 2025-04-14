import { TestBed } from '@angular/core/testing';
import { CirclePackingService } from './circle-packing.service';


describe('CirclePackingService', () => {
  let service: CirclePackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CirclePackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
