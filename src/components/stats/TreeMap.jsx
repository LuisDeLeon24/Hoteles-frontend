import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Box } from "@chakra-ui/react";

export default function TreemapChart({ data, height = 400 }) {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height });

  useEffect(() => {
    if (!data || !data.children || data.children.length === 0) {
      console.warn("TreemapChart: No data or empty children");
      return;
    }

    if (!dimensions.width || !dimensions.height) return; // Espera hasta tener dimensiones

    // Limpia SVG previo
    d3.select(containerRef.current).select("svg")?.remove();

    // Crea jerarquía
    const root = d3.hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => b.value - a.value);

    // Layout
    const treemapLayout = d3.treemap()
      .size([dimensions.width, dimensions.height])
      .padding(2);

    treemapLayout(root);

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .style("background-color", "#1a202c");

    const color = d3.scaleOrdinal(d3.schemeTableau10);
    const leaves = root.leaves();

    if (leaves.length === 0) {
      console.warn("TreemapChart: No leaves to display");
      return;
    }

    const nodes = svg.selectAll("g")
      .data(leaves)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    nodes.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.parent.data.name))
      .attr("stroke", "#fff");

    nodes.append("text")
      .attr("x", 4)
      .attr("y", 16)
      .text(d => `${d.parent.data.name}: ${d.data.name} (${d.data.value})`)
      .attr("fontSize", "10px")
      .attr("fill", "white")
      .style("pointer-events", "none"); // para que no interfiera con eventos

  }, [data, dimensions]);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        if (width !== dimensions.width) {
          setDimensions({ width, height });
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [containerRef, height, dimensions.width]);

  return (
    <Box ref={containerRef} width="100%" height={height} />
  );
}
