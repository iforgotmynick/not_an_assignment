import { Pipe, PipeTransform } from '@angular/core';
import { SingleRegionGroup } from '../../core/models/europe-region-group';

@Pipe({
  name: 'regionName',
  standalone: true,
})
export class RegionNamePipe implements PipeTransform {
  transform(group: SingleRegionGroup): keyof SingleRegionGroup {
    return Object.keys(group)[0] as keyof SingleRegionGroup;
  }
}
