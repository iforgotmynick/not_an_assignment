import { Pipe, PipeTransform } from '@angular/core';
import { EuropeRegion, SingleRegionGroup } from '../../core/models/europe-region-group';

@Pipe({
  name: 'regionName',
  standalone: true,
})
export class RegionNamePipe implements PipeTransform {
  transform(group: SingleRegionGroup): EuropeRegion {
    return Object.keys(group)[0] as EuropeRegion;
  }
}
