import { Pipe, PipeTransform } from '@angular/core';
import { Country } from '../../core/models/country';

@Pipe({
  name: 'sumArea',
  standalone: true,
})
export class SumAreaPipe implements PipeTransform {
  transform(countries: Country[] | null | undefined): number {
    if (!countries || !Array.isArray(countries)) return 0;

    return countries.reduce((sum, c) => sum + (c.land_area_km2 ?? 0), 0);
  }
}
