import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import mockData from '../../../assets/data/europe_population_enriched.json';
import { Continent } from '../models/continent';
import { EuropeRegion } from '../models/europe-region-group';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return Europe data structure with all regions', () => {
    const result = service.getData();
    expect(result).toBeTruthy();

    const regions = Object.keys(result.Europe);
    expect(regions).toContain('Northern Europe');
    expect(regions).toContain('Southern Europe');
    expect(regions).toContain('Eastern Europe');
    expect(regions).toContain('Western Europe');
    expect(regions.length).toBe(4);
  });

  it('should match the original mock data exactly', () => {
    const result = service.getData();
    expect(result).toEqual(mockData as Continent);
  });

  it('each region should have an array of countries with valid properties', () => {
    const result = service.getData();

    for (const region of Object.keys(result.Europe)) {
      const countries = result.Europe[region as EuropeRegion];
      expect(Array.isArray(countries)).toBeTrue();

      for (const country of countries) {
        expect(country.country).toBeDefined();
        expect(country.population).toBeGreaterThan(0);
        expect(country.wikipedia).toMatch(/^https:\/\/en\.wikipedia\.org/);
        expect(country.flag).toMatch(/^https:\/\/flagcdn\.com/);
        expect(country.land_area_km2).toBeGreaterThan(0);
      }
    }
  });
});
