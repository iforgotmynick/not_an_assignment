import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoDrawerComponent } from './info-drawer.component';
import { Country } from '../../core/models/country';
import { SingleRegionGroup } from '../../core/models/europe-region-group';

const testCountry: Country = {
  country: 'Testland',
  population: 2000,
  land_area_km2: 1000,
  wikipedia: 'tespage',
  flag: 'testflag',
};

const testRegion: SingleRegionGroup = {
  'Eastern Europe': [testCountry],
};

describe('InfoDrawerComponent', () => {
  let fixture: ComponentFixture<InfoDrawerComponent>;
  let component: InfoDrawerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InfoDrawerComponent],
    });

    fixture = TestBed.createComponent(InfoDrawerComponent);
    component = fixture.componentInstance;
  });

  it('should identify a Country input correctly using isCountry()', () => {
    expect(component.isCountry(testCountry)).toBeTrue();
  });

  it('should identify a RegionGroup input correctly using isCountry()', () => {
    expect(component.isCountry(testRegion)).toBeFalse();
  });

  it('should emit closeDrawer event when triggered', () => {
    spyOn(component.closeDrawer, 'emit');

    component.closeDrawer.emit();

    expect(component.closeDrawer.emit).toHaveBeenCalled();
  });

  it('should handle a Country input without error', () => {
    component.territory = testCountry;
    fixture.detectChanges();

    expect(component.isCountry(component.territory)).toBeTrue();
  });
});
