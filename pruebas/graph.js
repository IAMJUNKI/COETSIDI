const { Graph } = require('graphlib');

// Create a new directed graph
const g = new Graph({ directed: true });

// Add nodes and edges with weights
g.setNode('A');
g.setNode('B');
g.setNode('C');
g.setEdge('A', 'B', 3); // edge with weight 3
g.setEdge('A', 'C', 1); // edge with weight 1
g.setEdge('B', 'C', 2); // edge with weight 2

console.log(g.edges().map(e => `${e.v} -> ${e.w} (weight: ${g.edge(e)})`));

module.exports = g;