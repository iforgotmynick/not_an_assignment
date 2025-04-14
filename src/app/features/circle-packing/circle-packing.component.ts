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
  effect,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchyCircularNode } from 'd3-hierarchy';
import { Continent } from '../../core/models/continent';
import { DataService } from '../../core/data/data.service';
import { CirclePackingNode } from './models/circle-packing-node';
import { InfoDrawerComponent } from '../info-drawer/info-drawer.component';
import { Country } from '../../core/models/country';
import { EuropeRegion, SingleRegionGroup } from '../../core/models/europe-region-group';
import { ToggleSwitchComponent } from '../../shared/toggle-switch.component';
import { CirclePackingService } from './services/circle-packing.service';
import { CircleTypes } from './models/circle-types';
import { CirclePackingView } from './models/circle-packing-view';
@Component({
  selector: 'app-circle-packing',
  standalone: true,
  imports: [CommonModule, InfoDrawerComponent, ToggleSwitchComponent],
  templateUrl: './circle-packing.component.html',
  styleUrls: ['./circle-packing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePackingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('svgContainer', { static: true })
  svgRef!: ElementRef<SVGSVGElement>;

  private readonly dataService = inject(DataService);
  private readonly circlePackingService = inject(CirclePackingService);

  private resizeObserver!: ResizeObserver;

  readonly selectedTerritory: WritableSignal<Country | SingleRegionGroup | undefined> =
    signal(undefined);

  readonly width: WritableSignal<number | null> = signal<number | null>(null);
  readonly height: WritableSignal<number | null> = signal<number | null>(null);
  readonly metric: WritableSignal<CircleTypes> = signal<CircleTypes>('population');
  readonly data: WritableSignal<Continent | null> = signal<Continent | null>(null);

  readonly viewModel = computed<CirclePackingView>(() => ({
    type: this.metric(),
    data: this.data(),
    width: this.width(),
    height: this.height(),
  }));

  readonly _rerender = effect(() => {
    const { data, width, height } = this.viewModel();

    if (data && width && height) {
      this.render();
    }
  });

  ngOnInit(): void {
    this.data.set(this.dataService.getData());
  }

  ngAfterViewInit(): void {
    this.updateBounds();

    this.resizeObserver = new ResizeObserver(() => this.updateBounds());
    this.resizeObserver.observe(this.svgRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  private render(): void {
    const data = this.data();

    if (!data) return;

    this.circlePackingService.render({
      svgElement: this.svgRef.nativeElement,
      data,
      type: this.metric(),
      width: this.width()!,
      height: this.height()!,
      onNodeClick: this.onNodeClick,
    });
  }

  private updateBounds = () => {
    const { width, height } = this.svgRef.nativeElement.getBoundingClientRect();
    this.width.set(width);
    this.height.set(height);
  };

  private onNodeClick = (
    _: CirclePackingNode,
    d: HierarchyCircularNode<CirclePackingNode>,
  ): void => {
    if (!d.children && d.data.data) {
      this.selectedTerritory.set(d.data.data);
    } else if (d.children && d.data.name) {
      const regionName = d.data.name as EuropeRegion;
      const countries = d.children.map(child => child.data.data) as Country[];

      this.selectedTerritory.set({
        [regionName]: countries,
      } as SingleRegionGroup);
    }
  };
}
