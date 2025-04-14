import { CirclePackingService } from './circle-packing.service';
import { CircleTypes } from '../models/circle-types';
import { Continent } from '../../../core/models/continent';
import { Country } from '../../../core/models/country';
import { CirclePackingNode } from '../models/circle-packing-node';
import { SingleRegionGroup } from '../../../core/models/europe-region-group';

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
describe('CirclePackingService', () => {
  let service: CirclePackingService;
  let svgElement: SVGSVGElement;

  beforeEach(() => {
    service = new CirclePackingService();

    svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svgElement);
  });

  afterEach(() => {
    document.body.removeChild(svgElement);
  });

  it('should render circles and labels into the SVG', () => {
    const onClickSpy = jasmine.createSpy();

    service.render({
      svgElement,
      data: testContinent,
      type: 'population',
      width: 300,
      height: 300,
      onNodeClick: onClickSpy,
    });

    const circles = svgElement.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);

    const texts = svgElement.querySelectorAll('text');
    expect(texts.length).toBeGreaterThan(0);
  });

  it('should clear previous SVG contents before rendering new ones', () => {
    const preexisting = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svgElement.appendChild(preexisting);
    expect(svgElement.children.length).toBe(1);

    service.render({
      svgElement,
      data: testContinent,
      type: 'population',
      width: 300,
      height: 300,
      onNodeClick: () => {},
    });

    expect(svgElement.children.length).toBeGreaterThan(0);
    expect(svgElement.contains(preexisting)).toBeFalse();
  });

  it('should call onNodeClick when a circle is clicked', () => {
    const onClickSpy = jasmine.createSpy();

    service.render({
      svgElement,
      data: testContinent,
      type: 'population',
      width: 300,
      height: 300,
      onNodeClick: onClickSpy,
    });

    const circle = svgElement.querySelector('circle');
    expect(circle).toBeTruthy();

    (circle as SVGCircleElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onClickSpy).toHaveBeenCalled();
  });

  it('should set correct fill and stroke for circles', () => {
    service.render({
      svgElement,
      data: testContinent,
      type: 'land_area_km2',
      width: 300,
      height: 300,
      onNodeClick: () => {},
    });

    const circle = svgElement.querySelector('circle');
    expect(circle).toBeTruthy();

    const fill = circle?.getAttribute('fill');
    const stroke = circle?.getAttribute('stroke');

    expect(fill).toMatch(/^#[0-9a-f]{6}$/i);
    expect(stroke).toBe('#444');
  });
});
