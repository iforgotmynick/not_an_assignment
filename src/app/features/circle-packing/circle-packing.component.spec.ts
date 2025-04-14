import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CirclePackingComponent } from './circle-packing.component';
import { Country } from '../../core/models/country';
import { Continent } from '../../core/models/continent';
import { CirclePackingService } from './services/circle-packing.service';
import { DataService } from '../../core/data/data.service';
import { CirclePackingNode } from './models/circle-packing-node';
import { HierarchyCircularNode } from 'd3-hierarchy';
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
const testContinent: Continent = {
  Europe: {
    ...testRegion,
    'Northern Europe': [testCountry],
    'Southern Europe': [testCountry],
    'Western Europe': [testCountry],
  },
};

describe('CirclePackingComponent', () => {
  let fixture: ComponentFixture<CirclePackingComponent>;
  let component: CirclePackingComponent;
  let mockRender: jasmine.Spy;

  const dataServiceMock = {
    getData: () => testContinent,
  };

  const circlePackingServiceMock = {
    render: jasmine.createSpy('render'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CirclePackingComponent],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: CirclePackingService, useValue: circlePackingServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CirclePackingComponent);
    component = fixture.componentInstance;
    mockRender = circlePackingServiceMock.render;
    fixture.detectChanges();
  });

  it('should call dataService.getData() and set data on init', () => {
    expect(component.data()).toEqual(testContinent);
  });

  it('should call circlePackingService.render() with expected args once signals are set', () => {
    const mockRect = { width: 400, height: 300 };

    component.svgRef = {
      nativeElement: {
        getBoundingClientRect: () => mockRect,
      },
    } as any;

    component.width.set(mockRect.width);
    component.height.set(mockRect.height);
    component.data.set(testContinent);

    fixture.detectChanges();

    const matchingCalls = mockRender.calls
      .all()
      .filter(
        call =>
          call.args[0].width === mockRect.width &&
          call.args[0].height === mockRect.height &&
          call.args[0].type === 'population' &&
          call.args[0].data === testContinent,
      );

    expect(matchingCalls.length).toBeGreaterThan(0);
  });

  it('should set selectedTerritory when clicking a leaf (Country)', () => {
    const node: HierarchyCircularNode<CirclePackingNode> = {
      children: undefined,
      data: {
        name: 'Testland',
        value: 1000,
        data: testCountry,
      },
    } as any;

    component['onNodeClick'](node.data, node);

    expect(component.selectedTerritory()).toEqual(testCountry);
  });

  it('should set selectedTerritory when clicking a branch (Region)', () => {
    const regionName = 'Eastern Europe';
    const node: HierarchyCircularNode<CirclePackingNode> = {
      data: {
        name: regionName,
      },
      children: testRegion[regionName].map(country => ({
        data: {
          name: country.country,
          data: country,
        },
      })),
    } as any;

    component['onNodeClick'](node.data, node);

    expect(component.selectedTerritory()).toEqual(testRegion);
  });

  it('should disconnect ResizeObserver on destroy', () => {
    const disconnectSpy = jasmine.createSpy('disconnect');

    component['resizeObserver'] = {
      observe: () => {},
      disconnect: disconnectSpy,
    } as any;

    component.ngOnDestroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });
});
