import { Injectable } from '@angular/core';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { HierarchyCircularNode, hierarchy, pack } from 'd3-hierarchy';
import { ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { select, Selection } from 'd3-selection';
import { Continent } from '../../../core/models/continent';
import { CirclePackingNode } from '../models/circle-packing-node';
import { lightenColor } from '../utils/circle-packing';
import { CircleTypes } from '../models/circle-types';

@Injectable({ providedIn: 'root' })
export class CirclePackingService {
  render(config: {
    svgElement: SVGSVGElement;
    data: Continent;
    type: CircleTypes;
    width: number;
    height: number;
    onNodeClick: (
      node: CirclePackingNode,
      d: HierarchyCircularNode<CirclePackingNode>
    ) => void;
  }) {
    const svg = select(config.svgElement);
    svg.selectAll('*').remove();

    const hierarchyData: CirclePackingNode = this.buildHierarchy(
      config.data,
      config.type
    );

    const root = hierarchy<CirclePackingNode>(hierarchyData)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const packedRoot = pack<CirclePackingNode>()
      .size([config.width, config.height])
      .padding(5)(root);

    const countriesColor = scaleOrdinal<string>()
      .domain(Object.keys(config.data.Europe))
      .range(schemeCategory10);

    this.renderCircles(svg, packedRoot, countriesColor, config.onNodeClick);
    this.renderLabels(svg, packedRoot);
    this.renderRegionLabels(svg, packedRoot, countriesColor);
  }

  private renderCircles(
    svg: Selection<SVGSVGElement, unknown, null, undefined>,
    packedRoot: HierarchyCircularNode<CirclePackingNode>,
    countriesColor: ScaleOrdinal<string, string, never>,
    onNodeClick: (
      node: CirclePackingNode,
      d: HierarchyCircularNode<CirclePackingNode>
    ) => void
  ): void {
    const circles = svg
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
      .on('click', (_, d) => onNodeClick(_, d));

    this.handleMouseOver(circles);
    this.handleMouseOut(circles, countriesColor);
  }

  private renderLabels(
    svg: Selection<SVGSVGElement, unknown, null, undefined>,
    packedRoot: HierarchyCircularNode<CirclePackingNode>
  ): void {
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

  private renderRegionLabels(
    svg: Selection<SVGSVGElement, unknown, null, undefined>,
    packedRoot: HierarchyCircularNode<CirclePackingNode>,
    countriesColor: ScaleOrdinal<string, string, never>
  ): void {
    svg
      .append('g')
      .selectAll('text.region-label')
      .data(packedRoot.children || [])
      .enter()
      .append('text')
      .attr('class', 'region-label')
      .attr('x', (d) => {
        const yAbove = d.y! - d.r! - 10;

        return yAbove < 0 ? d.x! + d.r! * 0.8 : d.x!;
      })
      .attr('y', (d) => {
        const yAbove = d.y! - d.r! - 10;

        return yAbove < 0 ? d.y! - d.r! + 15 : yAbove;
      })
      .attr('text-anchor', (d) => {
        const yAbove = d.y! - d.r! - 10;

        return yAbove < 0 ? 'start' : 'middle';
      })
      .text((d) => d.data.name)
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .style('fill', (d) => countriesColor(d.data.name))
      .style('pointer-events', 'none');
  }

  private handleMouseOver(
    selection: Selection<
      SVGCircleElement,
      HierarchyCircularNode<CirclePackingNode>,
      any,
      any
    >
  ): void {
    selection.on('mouseover', function () {
      const currentFill = select(this).attr('fill');
      const lighter = lightenColor(currentFill, 15);
      select(this)
        .attr('stroke', '#000')
        .attr('stroke-width', 2)
        .attr('fill', lighter);
    });
  }

  private handleMouseOut(
    selection: Selection<
      SVGCircleElement,
      HierarchyCircularNode<CirclePackingNode>,
      any,
      any
    >,
    countriesColor: ScaleOrdinal<string, string, never>
  ): void {
    selection.on('mouseout', function () {
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
    });
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
}
