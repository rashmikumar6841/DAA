// Turns a flat backtracking/B&B trace (parentId links) into a laid-out tree:
// x position via post-order leaf counting, y position via depth.
export function buildTree(trace) {
  const byId = new Map();
  trace.forEach((n, order) => byId.set(n.id, { ...n, order, children: [] }));
  const roots = [];
  byId.forEach((n) => {
    if (n.parentId === -1 || !byId.has(n.parentId)) roots.push(n);
    else byId.get(n.parentId).children.push(n);
  });

  let leafCounter = 0;
  function assign(node) {
    if (node.children.length === 0) {
      node.x = leafCounter++;
      return node.x;
    }
    const xs = node.children.map(assign);
    node.x = xs.reduce((a, b) => a + b, 0) / xs.length;
    return node.x;
  }
  roots.forEach(assign);

  const nodes = Array.from(byId.values());
  const edges = [];
  nodes.forEach((n) => {
    if (n.parentId !== -1 && byId.has(n.parentId)) {
      edges.push({ from: byId.get(n.parentId), to: n, order: n.order });
    }
  });

  const maxDepth = Math.max(0, ...nodes.map((n) => n.depth));
  const leafCount = Math.max(1, leafCounter);
  return { nodes, edges, roots, maxDepth, leafCount };
}
