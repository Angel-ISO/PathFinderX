export class GraphBuilder {
  constructor(nodes, ways) {
    this.nodes = nodes;
    this.ways = ways;
  }

  build() {
    const graph = new Map();

    this.nodes.forEach(node => {
      graph.set(node._id, {
        nodeData: node,
        edges: new Set()
      });
    });

    this.ways.forEach(way => {
      this.processWay(way, graph);
    });

    return graph;
  }

  processWay(way, graph) {
    for (let i = 0; i < way.nodes.length - 1; i++) {
      const from = way.nodes[i];
      const to = way.nodes[i + 1];
      
      if (graph.has(from) && graph.has(to)) {
        graph.get(from).edges.add(to);
        if (!way.tags?.oneway) {
          graph.get(to).edges.add(from);
        }
      }
    }
  }
}