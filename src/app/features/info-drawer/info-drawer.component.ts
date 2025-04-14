import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Country } from '../../core/models/country';
import { SingleRegionGroup } from '../../core/models/europe-region-group';
import { RegionNamePipe } from './region-name.pipe';
import { SumPopulationPipe } from './sum-population.pipe';
import { SumAreaPipe } from './sum-area.pipe';

@Component({
  selector: 'app-info-drawer',
  imports: [CommonModule, RegionNamePipe, SumPopulationPipe, SumAreaPipe],
  templateUrl: './info-drawer.component.html',
  styleUrls: ['./info-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoDrawerComponent {
  @Input() territory!: Country | SingleRegionGroup;
  @Output() readonly closeDrawer = new EventEmitter<void>();

  // if Country then show template as expected
  // if region - show accumulated stats
  isCountry(territory: Country | SingleRegionGroup): territory is Country {
    return 'country' in territory;
  }
}
