import { hierarchy, tree } from 'd3-hierarchy';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import { path } from 'd3-path';

const data = {
  name: 'Eve',
  children: [
    { name: 'Cain' },
    {
      name: 'Seth',
      children: [
        { name: 'Enos' },
        { name: 'Noam' },
        { name: 'Kimi' },
        { name: 'harumeow' },
      ],
    },
    { name: 'Abel', children: [{ name: 'Ebichu' }] },
    { name: 'Awan', children: [{ name: 'Enoch' }] },
    { name: 'Azura' },
  ],
};

const root = hierarchy(data);

const treeRoot = tree();
treeRoot.size([360, 250]);
if (true) {
  treeRoot.separation(function separation(a, b) {
    return (a.parent == b.parent ? 1 : 2) / a.depth;
  });
}

treeRoot(root);

console.log(root);

const ctx = document.getElementById('canvas').getContext('2d');

function drawNode(node) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(node.y + 5, node.x, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  ctx.fillText(node.data.name, node.y + 15, node.x);
}

function drawLine(startX, startY, endX, endY) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(startX + 100, startY, endX - 100, endY, endX, endY);
  ctx.stroke();
  ctx.restore();
}

function travesalDraw(node) {
  drawNode(node);
  if (node.children) {
    node.children.forEach((child) => {
      travesalDraw(child);
      drawLine(node.y, node.x, child.y, child.x);
    });
  }
}

travesalDraw(root);

const canvas = select(ctx.canvas);

canvas.call(
  zoom()
    .scaleExtent([1, 8])
    .on('zoom', ({ transform }) => zoomed(root, transform))
);

function zoomed(rootNode, transform, parent) {
  ctx.save();
  if (!parent) {
    ctx.clearRect(0, 0, 400, 450);
  }

  const [x, y] = transform.apply([rootNode.x, rootNode.y]);

  if (parent) {
    const [parentX, parentY] = parent;
    drawLine(parentY, parentX, y, x);
  }

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(y + 5, x, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillText(rootNode.data.name, y + 15, x);
  ctx.restore();
  if (rootNode.children) {
    rootNode.children?.forEach((node) => zoomed(node, transform, [x, y]));
  }
}
