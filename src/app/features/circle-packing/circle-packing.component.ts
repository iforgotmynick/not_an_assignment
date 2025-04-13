import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  inject,
  OnDestroy,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { hierarchy, pack, HierarchyCircularNode } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { rgb } from 'd3-color';
import { Continent } from '../../core/models/continent';
import { DataService } from '../../core/data/data.service';
import { CirclePackingNode } from './circle-packing-node';
import { InfoDrawerComponent } from '../info-drawer/info-drawer.component';
import { Country } from '../../core/models/country';
import {
  EuropeRegion,
  EuropeRegionGroup,
  SingleRegionGroup,
} from '../../core/models/europe-region-group';

@Component({
  selector: 'app-circle-packing',
  standalone: true,
  imports: [CommonModule, InfoDrawerComponent],
  templateUrl: './circle-packing.component.html',
  styleUrls: ['./circle-packing.component.scss'],
})
export class CirclePackingComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('svgContainer', { static: true })
  svgRef!: ElementRef<SVGSVGElement>;

  private readonly dataService = inject(DataService);
  private readonly margin = 40;
  private width: number | null = null;
  private height: number | null = null;

  readonly selectedTerritory: WritableSignal<
    Country | SingleRegionGroup | undefined
  > = signal(undefined);

  type: 'population' | 'land_area_km2' = 'population';
  data: Continent | null = null;

  ngOnInit(): void {
    this.data = this.dataService.getData();
  }

  ngAfterViewInit(): void {
    this.updateAndRender();
    window.addEventListener('resize', this.updateAndRender);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateAndRender);
  }

  private render(): void {
    if (!this.data || !this.svgRef) return;

    const svg = select(this.svgRef.nativeElement);
    svg.selectAll('*').remove();

    const hierarchyData: CirclePackingNode = this.buildHierarchy(
      this.data,
      this.type
    );

    const root = hierarchy<CirclePackingNode>(hierarchyData)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const packedRoot = pack<CirclePackingNode>()
      .size([this.width!, this.height!])
      .padding(5)(root);

    const countriesColor = scaleOrdinal<string>()
      .domain(Object.keys(this.data.Europe))
      .range(schemeCategory10);

    const lightenColor = (input: string, percent: number): string => {
      const c = rgb(input);
      if (!c) return '#ccc';

      c.r = Math.min(255, Math.floor(c.r * (1 + percent / 100)));
      c.g = Math.min(255, Math.floor(c.g * (1 + percent / 100)));
      c.b = Math.min(255, Math.floor(c.b * (1 + percent / 100)));

      return c.formatHex();
    };

    svg
      .append('g')
      .selectAll('circle')
      .data(packedRoot.descendants().slice(1))
      .enter()
      .append('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', (d) => d.r)
      .attr('fill', (d) => {
        if (d.children) {
          const color = countriesColor(d.data.name);
          return lightenColor(color, 40);
        }
        return countriesColor(d.parent?.data.name || '');
      })
      .attr('stroke', '#444')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function () {
        const currentFill = select(this).attr('fill');
        const lighter = lightenColor(currentFill, 15);
        select(this)
          .attr('stroke', '#000')
          .attr('stroke-width', 2)
          .attr('fill', lighter);
      })
      .on('mouseout', function () {
        const d = select(
          this
        ).datum() as HierarchyCircularNode<CirclePackingNode>;
        const baseColor = d.children
          ? lightenColor(countriesColor(d.data.name), 40)
          : countriesColor(d.parent?.data.name || '');
        select(this)
          .attr('stroke', '#444')
          .attr('stroke-width', 1)
          .attr('fill', baseColor);
      })
      .on('click', (_, d) => {
        if (!d.children && d.data.data) {
          // Leaf node → country
          this.selectedTerritory.set(d.data.data);
        } else if (d.children && d.data.name) {
          const regionName = d.data.name as EuropeRegion;
          const countries = d.children.map(
            (child) => child.data.data
          ) as Country[];

          this.selectedTerritory.set({
            [regionName]: countries,
          } as SingleRegionGroup);
        }
      });

    svg
      .append('g')
      .selectAll('text')
      .data(packedRoot.descendants().filter((d) => !d.children))
      .enter()
      .append('text')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .text((d) => d.data.name)
      .style('font-size', '10px')
      .style('pointer-events', 'none')
      .style('fill', '#333');
  }

  private buildHierarchy(
    data: Continent,
    type: 'population' | 'land_area_km2'
  ): CirclePackingNode {
    return {
      name: 'Europe',
      children: Object.entries(data.Europe).map(([region, countries]) => ({
        name: region,
        children: countries.map((country) => ({
          name: country.country,
          value: country[type],
          data: country,
        })),
      })),
    };
  }

  private updateAndRender = () => {
    const { width, height } = this.svgRef.nativeElement.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.render();
  };
}
