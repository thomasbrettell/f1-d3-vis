import React, { useEffect } from 'react';
import * as d3 from 'd3';
import data from '../scripts/f1-data-transformed.json';
console.log(data);
import './styles.scss';

const Vis = () => {
  useEffect(() => {
    const svg = d3.select('svg'),
      width = +svg.attr('width'),
      height = +svg.attr('height');

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3.forceLink().id(function (d) {
          return d.id;
        })
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke-width', '0.25');

    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    node
      .append('circle')
      .attr('r', 5)
      .attr('fill', function (d) {
        return color(d.group);
      });

    node
      .append('text')
      .text(function (d) {
        return d.id;
      })
      .attr('dy', '0.3em')
      .attr('dx', '0.6em');

    simulation.nodes(data.nodes).on('tick', ticked);

    simulation.force('link').links(data.links);

    function ticked() {
      link
        .attr('x1', function (d) {
          return d.source.x;
        })
        .attr('y1', function (d) {
          return d.source.y;
        })
        .attr('x2', function (d) {
          return d.target.x;
        })
        .attr('y2', function (d) {
          return d.target.y;
        });

      node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  });
  return (
    <>
      {/* <header>
        <h1>Link between all F1 drivers and who they have driven against</h1>
        <p>
          <a
            href='https://www.formula1.com/en/results.html'
            target='_blank'
            rel='noreferrer'
          >
            Source: F1 Results
          </a>
        </p>
      </header> */}
      <svg width={window.innerWidth} height={window.innerHeight} />
    </>
  );
};

export default Vis;
