import { Pipe, PipeTransform } from '@angular/core';
import { Country } from '../../core/models/country';

@Pipe({
  name: 'sumPopulation',
  standalone: true,
})
export class SumPopulationPipe implements PipeTransform {
  transform(countries: Country[] | null | undefined): number {
    if (!countries || !Array.isArray(countries)) return 0;

    return countries.reduce((sum, c) => sum + (c.population ?? 0), 0);
  }
}
