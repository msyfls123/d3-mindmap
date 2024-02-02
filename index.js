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

function drawNode(x, y, name) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.fillStyle = 'red';
  ctx.arc(y + 5, x, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = 'green';
  ctx.fillText(name, y + 15, x);
}

function drawLine(startX, startY, endX, endY) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(startX + 100, startY, endX - 100, endY, endX, endY);
  ctx.stroke();
  ctx.restore();
}

function travesalDraw(node) {
  drawNode(node.x, node.y, node.data.name);
  if (node.children) {
    node.children.forEach((child) => {
      travesalDraw(child);
      drawLine(node.y + 8, node.x, child.y, child.x);
    });
  }
}

travesalDraw(root);

const canvas = select(ctx.canvas);

canvas.call(
  zoom()
    .scaleExtent([1, 8])
    .translateExtent([
      [0, 0],
      [400, 450],
    ])
    .on('zoom', ({ transform }) => zoomed(root, transform))
);

function zoomed(rootNode, transform, parent) {
  ctx.save();
  if (!parent) {
    ctx.clearRect(0, 0, 400, 450);
  }

  const [y, x] = transform.apply([rootNode.y, rootNode.x]);

  if (parent) {
    const [parentX, parentY] = parent;
    drawLine(parentY + 10, parentX, y, x);
  }

  drawNode(x, y, rootNode.data.name);
  if (rootNode.children) {
    rootNode.children?.forEach((node) => zoomed(node, transform, [x, y]));
  }
}
